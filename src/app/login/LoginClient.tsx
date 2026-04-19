"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { LoginUser } from "@/Api/controllers/UserController";
import ModalComponent from "@/components/ModalCompanent";

const LoginClient = () => {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Şifremi Unuttum state'leri
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [forgotSuccess, setForgotSuccess] = useState("");

    // Şifre Sıfırlama state'leri
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetCode1, setResetCode1] = useState("");
    const [resetCode2, setResetCode2] = useState("");
    const resetCode2Ref = useRef<HTMLInputElement>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPasswordField, setShowNewPasswordField] = useState(false);
    const [showConfirmPasswordField, setShowConfirmPasswordField] =
        useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");
    // Resend countdown (seconds)
    const [resendSeconds, setResendSeconds] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (resendSeconds <= 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        if (timerRef.current) return;
        timerRef.current = window.setInterval(() => {
            setResendSeconds((s) => {
                if (s <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [resendSeconds]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!identifier || !password) {
            setError("Lütfen tüm alanları doldurun");
            return;
        }

        try {
            let res = await LoginUser({ identifier, password });
            if (res && res.status === 200) {
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } else {
                setError("Kullanıcı adı şifreniz hatalı veya hesap oluşturun");
            }
        } catch (err) {
            setError("Kullanıcı adı şifreniz hatalı veya hesap oluşturun");
        }
    };

    const isNewPasswordLongEnough = newPassword.length >= 6;
    const isNewPasswordHasUpper = /[A-ZÇĞİÖŞÜ]/.test(newPassword);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Logo ve Başlık */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-100">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
                        <p className="text-gray-600 mt-2">Hesabınıza giriş yapın</p>
                    </div>

                    {/* Hata Mesajı */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    {/* Başarı Mesajı */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            Başarıyla giriş yapıldı! Ana sayfaya yönlendiriliyorsunuz...
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                E-posta veya Telefon Numarası
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="E-posta veya telefon numarası"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Şifre
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition shadow-md hover:shadow-lg"
                        >
                            Giriş Yap
                        </button>
                    </form>

                    {/* Şifremi Unuttum Linki */}
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline"
                        >
                            Şifremi Unuttum?
                        </button>
                    </div>

                    {/* Kayıt Linki */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Hesabınız yok mu?{" "}
                            <Link
                                href="/register"
                                className="text-cyan-600 hover:text-cyan-700 font-semibold"
                            >
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Şifremi Unuttum Modal */}
            <ModalComponent
                isOpen={showForgotPassword}
                onClose={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                    setForgotError("");
                    setForgotSuccess("");
                }}
                title="Şifremi Unuttum"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        E-posta adresinizi girin, size şifre sıfırlama kodu gönderelim.
                    </p>

                    {forgotError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {forgotError}
                        </div>
                    )}

                    {forgotSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {forgotSuccess}
                        </div>
                    )}

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setForgotError("");
                            setForgotSuccess("");

                            if (!forgotEmail) {
                                setForgotError("Lütfen e-posta adresinizi girin");
                                return;
                            }

                            try {
                                const { forgotPassword } = await import(
                                    "@/Api/controllers/UserController"
                                );
                                await forgotPassword(forgotEmail);
                                setForgotSuccess(
                                    "Şifre sıfırlama kodu e-posta adresinize gönderildi!"
                                );
                                setTimeout(() => {
                                    setShowForgotPassword(false);
                                    setShowResetPassword(true);
                                    // start 3 minute countdown
                                    setResendSeconds(180);
                                    setForgotSuccess("");
                                }, 2000);
                            } catch (err: any) {
                                setForgotError(
                                    err.response?.data?.message ||
                                    "Doğrulama Kodu 3 dakika içerisinde tekrar gönderilemez."
                                );
                                setTimeout(() => {
                                    setShowForgotPassword(false);
                                    setShowResetPassword(true);
                                    // start 3 minute countdown
                                    setResendSeconds(180);
                                    setForgotSuccess("");
                                }, 2000);
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="forgot-email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                E-posta Adresi
                            </label>
                            <input
                                id="forgot-email"
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotEmail("");
                                    setForgotError("");
                                    setForgotSuccess("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-800 transition font-medium"
                            >
                                Kod Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </ModalComponent>

            {/* Şifre Sıfırlama Modal */}
            <ModalComponent
                isOpen={showResetPassword}
                onClose={() => {
                    setShowResetPassword(false);
                    setResetCode1("");
                    setResetCode2("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setResetError("");
                    setResetSuccess("");
                    setForgotEmail("");
                    setResendSeconds(0);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }}
                title="Şifre Sıfırlama"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        E-postanıza gelen kodu ve yeni şifrenizi girin.
                    </p>

                    {resetError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {resetError}
                        </div>
                    )}

                    {resetSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {resetSuccess}
                        </div>
                    )}

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setResetError("");
                            setResetSuccess("");

                            if (
                                !resetCode1 ||
                                !resetCode2 ||
                                !newPassword ||
                                !confirmPassword
                            ) {
                                setResetError("Lütfen tüm alanları doldurun");
                                return;
                            }

                            if (newPassword !== confirmPassword) {
                                setResetError("Şifreler eşleşmiyor");
                                return;
                            }

                            if (newPassword.length < 6) {
                                setResetError("Şifre en az 6 karakter olmalıdır");
                                return;
                            }

                            if (!/[A-ZÇĞİÖŞÜ]/.test(newPassword)) {
                                setResetError("Şifre en az bir büyük harf içermelidir");
                                return;
                            }

                            try {
                                const { resetPassword } = await import(
                                    "@/Api/controllers/UserController"
                                );
                                await resetPassword({
                                    email: forgotEmail,
                                    code: `${resetCode1}-${resetCode2}`,
                                    newPassword: newPassword,
                                });
                                setResetSuccess(
                                    "Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz..."
                                );
                                setTimeout(() => {
                                    setShowResetPassword(false);
                                    setResetCode1("");
                                    setResetCode2("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setResetSuccess("");
                                    setResetSuccess("");
                                }, 2000);
                            } catch (err: any) {
                                setResetError(
                                    err.response?.data?.message ||
                                    "Bir hata oluştu. Lütfen tekrar deneyin."
                                );
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="reset-code"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Sıfırlama Kodu
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="reset-code-1"
                                    type="text"
                                    value={resetCode1}
                                    onChange={(e) => {
                                        const val = e.target.value
                                            .replace(/[^A-Z0-9]/gi, "")
                                            .toUpperCase()
                                            .slice(0, 3);
                                        setResetCode1(val);
                                        if (val.length === 3) {
                                            resetCode2Ref.current?.focus();
                                        }
                                    }}
                                    onPaste={(e) => {
                                        const pasted = e.clipboardData
                                            .getData("text")
                                            .trim()
                                            .toUpperCase();
                                        if (/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(pasted)) {
                                            const [first, second] = pasted.split("-");
                                            setResetCode1(first);
                                            setResetCode2(second);
                                            setTimeout(() => {
                                                resetCode2Ref.current?.focus();
                                                resetCode2Ref.current?.select();
                                            }, 0);
                                            e.preventDefault();
                                        }
                                    }}
                                    className="w-16 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center uppercase"
                                    maxLength={3}
                                    placeholder="XXX"
                                    autoComplete="one-time-code"
                                />
                                <span className="font-bold">-</span>
                                <input
                                    id="reset-code-2"
                                    type="text"
                                    value={resetCode2}
                                    ref={resetCode2Ref}
                                    onChange={(e) =>
                                        setResetCode2(
                                            e.target.value
                                                .replace(/[^A-Z0-9]/gi, "")
                                                .toUpperCase()
                                                .slice(0, 3)
                                        )
                                    }
                                    className="w-16 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center uppercase"
                                    maxLength={3}
                                    placeholder="XXX"
                                    autoComplete="one-time-code"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Yeni Şifre
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    id="new-password"
                                    type={showNewPasswordField ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="En az 6 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPasswordField((s) => !s)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm"
                                >
                                    {showNewPasswordField ? "Gizle" : "Göster"}
                                </button>
                            </div>

                            <div className="mt-2 text-sm">
                                <div
                                    className={
                                        isNewPasswordLongEnough ? "text-green-600" : "text-red-500"
                                    }
                                >
                                    {isNewPasswordLongEnough ? "✓" : "✕"} En az 6 karakter
                                </div>
                                <div
                                    className={
                                        isNewPasswordHasUpper ? "text-green-600" : "text-red-500"
                                    }
                                >
                                    {isNewPasswordHasUpper ? "✓" : "✕"} En az 1 büyük harf
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Yeni Şifre (Tekrar)
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPasswordField ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Şifrenizi tekrar girin"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPasswordField((s) => !s)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm"
                                >
                                    {showConfirmPasswordField ? "Gizle" : "Göster"}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div>Kodu almadınız mı?</div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setForgotError("");
                                        setForgotSuccess("");
                                        if (!forgotEmail) {
                                            setForgotError(
                                                "E-posta adresi bulunamadı. Lütfen önce kod isteyin."
                                            );
                                            return;
                                        }
                                        try {
                                            const { forgotPassword } = await import(
                                                "@/Api/controllers/UserController"
                                            );
                                            await forgotPassword(forgotEmail);
                                            setForgotSuccess("Kod yeniden gönderildi.");
                                            setResendSeconds(180);
                                            setTimeout(() => setForgotSuccess(""), 3000);
                                        } catch (err: any) {
                                            setForgotError(
                                                err.response?.data?.message ||
                                                "Tekrar gönderilemedi. Lütfen tekrar deneyin."
                                            );
                                        }
                                    }}
                                    className={`px-3 py-1 rounded-md font-medium border ${resendSeconds > 0
                                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "bg-cyan-600 text-white hover:bg-cyan-700 border-cyan-600"
                                        }`}
                                    disabled={resendSeconds > 0}
                                >
                                    Kodu Yeniden Gönder
                                </button>
                                <div className="w-24 text-right">
                                    {resendSeconds > 0 ? (
                                        <span className="text-sm text-gray-600">
                                            {Math.floor(resendSeconds / 60)
                                                .toString()
                                                .padStart(2, "0")}
                                            :{(resendSeconds % 60).toString().padStart(2, "0")}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-600">
                                            Yeniden gönder
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowResetPassword(false);
                                    setResetCode1("");
                                    setResetCode2("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setResetError("");
                                    setResetSuccess("");
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-800 transition font-medium"
                            >
                                Şifreyi Sıfırla
                            </button>
                        </div>
                    </form>
                </div>
            </ModalComponent>
        </div>
    );
};

export default LoginClient;
