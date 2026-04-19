"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/Api/controllers/UserController";

const RegisterClient = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [tcNumber, setTcNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useRouter();

    // Şifre güvenlik kontrolü
    const checkPasswordStrength = (
        pwd: string
    ): { isValid: boolean; message: string } => {
        if (pwd.length < 8) {
            return { isValid: false, message: "Şifre en az 8 karakter olmalıdır" };
        }
        if (!/[A-Z]/.test(pwd)) {
            return {
                isValid: false,
                message: "Şifre en az bir büyük harf içermelidir",
            };
        }
        if (!/[a-z]/.test(pwd)) {
            return {
                isValid: false,
                message: "Şifre en az bir küçük harf içermelidir",
            };
        }
        if (!/[0-9]/.test(pwd)) {
            return { isValid: false, message: "Şifre en az bir rakam içermelidir" };
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
            return {
                isValid: false,
                message: "Şifre en az bir özel karakter içermelidir (!@#$%^&* vb.)",
            };
        }
        return { isValid: true, message: "Güçlü şifre" };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validasyon
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !tcNumber ||
            !password ||
            !confirmPassword
        ) {
            setError("Lütfen tüm alanları doldurun");
            return;
        }

        // TC Kimlik numarası kontrolü (11 haneli olmalı)
        if (tcNumber.length !== 11 || !/^\d+$/.test(tcNumber)) {
            setError("TC Kimlik numarası 11 haneli olmalıdır");
            return;
        }

        // Telefon numarası kontrolü (10 haneli olmalı)
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            setError("Cep telefonu numarası 10 haneli olmalıdır (örn: 5551234567)");
            return;
        }

        // Şifre güvenlik kontrolü
        const passwordCheck = checkPasswordStrength(password);
        if (!passwordCheck.isValid) {
            setError(passwordCheck.message);
            return;
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        // DTO'ya göre veri yapısı
        const registerData = {
            phoneNumber: phone,
            name: firstName,
            lastName: lastName,
            citizenNo: tcNumber,
            mail: email,
            password: password,
            referenceCode: "", // İsteğe bağlı - boş bırakılabilir
            phoneConfirm: false,
            mailConfirm: false,
        };

        try {
            const response = await registerUser(registerData);
            if (response) {
                setSuccess(
                    "Kayıt işleminiz başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz..."
                );

                // 2 saniye sonra login sayfasına yönlendir
                setTimeout(() => {
                    navigate.push("/login");
                }, 2000);
            }
        } catch (error: any) {
            // API'den gelen hata mesajını göster
            setError(
                "Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Logo ve Başlık */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-100">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Kayıt Ol</h2>
                        <p className="text-gray-600 mt-2">Yeni hesap oluşturun</p>
                    </div>

                    {/* Hata Mesajı */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Başarı Mesajı */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Ad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Ahmet"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Soyad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Yılmaz"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    E-posta <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Cep Telefonu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    maxLength={10}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="5551234567"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="tcNumber"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                TC Kimlik Numarası <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="tcNumber"
                                type="text"
                                value={tcNumber}
                                onChange={(e) => setTcNumber(e.target.value.replace(/\D/g, ""))}
                                maxLength={11}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="12345678901"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Şifre <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {password && (
                                <p
                                    className={`text-xs mt-1 ${checkPasswordStrength(password).isValid
                                            ? "text-green-600"
                                            : "text-orange-600"
                                        }`}
                                >
                                    {checkPasswordStrength(password).message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Şifre (Tekrar) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
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
                            Kayıt Ol
                        </button>
                    </form>

                    {/* Giriş Linki */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Zaten hesabınız var mı?{" "}
                            <Link
                                href="/login"
                                className="text-cyan-600 hover:text-cyan-700 font-semibold"
                            >
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterClient;
