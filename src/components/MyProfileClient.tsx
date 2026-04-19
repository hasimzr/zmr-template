"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle, Copy, Trash2 } from "lucide-react";
import {
    updateUserProfileApi,
    deleteUserAccountApi,
} from "@/Api/controllers/UserController";

const MyProfileClient = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const deletePhrase = "HESABIMI SİLMEK İSTİYORUM";
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteInput, setDeleteInput] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteMessage, setDeleteMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Mesajı temizle
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Validasyonlar
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setMessage({ type: "error", text: "Ad ve soyad alanları zorunludur." });
            return;
        }

        if (!formData.email.trim() || !formData.email.includes("@")) {
            setMessage({
                type: "error",
                text: "Geçerli bir e-posta adresi giriniz.",
            });
            return;
        }

        if (!currentPassword.trim()) {
            setMessage({
                type: "error",
                text: "Profil değişiklikleri için mevcut şifrenizi girin.",
            });
            return;
        }

        setIsSaving(true);

        try {
            const updateData: any = {
                name: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                mail: formData.email.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                password: currentPassword.trim(),
            };

            const response = await updateUserProfileApi(updateData);

            if (response && response.data) {
                // LocalStorage'daki kullanıcı bilgilerini güncelle
                const currentUser = localStorage.getItem("currentUser");
                if (currentUser) {
                    const userData = JSON.parse(currentUser);
                    userData.firstName = response.data.firstName;
                    userData.lastName = response.data.lastName;
                    userData.email = response.data.email;
                    userData.phoneNumber = response.data.phoneNumber;
                    localStorage.setItem("currentUser", JSON.stringify(userData));
                }

                setMessage({
                    type: "success",
                    text: "Profil bilgileriniz başarıyla güncellendi!",
                });
                setCurrentPassword("");
                setIsEditing(false);

                // Sayfayı yenile (context'in güncellenmesi için)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error: any) {
            console.error("Profil güncellenirken hata:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Profil bilgileri güncellenirken bir hata oluştu.";
            setMessage({ type: "error", text: errorMessage });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Formu sıfırla
        setFormData({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
        });
        setCurrentPassword("");
        setMessage(null);
    };

    const handleCopyPhrase = async () => {
        try {
            await navigator.clipboard.writeText(deletePhrase);
            setDeleteMessage({
                type: "success",
                text: "Doğrulama cümlesi kopyalandı, alana yapıştırın.",
            });
        } catch (err) {
            setDeleteMessage({
                type: "error",
                text: "Kopyalama başarısız oldu, manuel kopyalayın.",
            });
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteMessage(null);
        if (deleteInput.trim() !== deletePhrase) {
            setDeleteMessage({
                type: "error",
                text: "Lütfen doğrulama cümlesini aynen yapıştırın.",
            });
            return;
        }

        if (!deletePassword.trim()) {
            setDeleteMessage({
                type: "error",
                text: "Hesap silme talebi için mevcut şifrenizi girin.",
            });
            return;
        }

        setIsDeleting(true);
        try {
            await deleteUserAccountApi({
                confirmText: deleteInput,
                password: deletePassword.trim(),
            });
            setDeleteMessage({
                type: "success",
                text: "Hesap silme talebiniz alındı. Çıkış yapılıyor...",
            });
            setDeletePassword("");
            localStorage.removeItem("currentUser");
            logout();
            setTimeout(() => {
                window.location.href = "/";
            }, 1200);
        } catch (error: any) {
            const errText =
                error?.response?.data?.message ||
                "Hesap silme sırasında bir hata oluştu.";
            setDeleteMessage({ type: "error", text: errText });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    Profil Bilgilerim
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                    >
                        Düzenle
                    </button>
                )}
            </div>

            {message && (
                <div
                    className={`p-4 rounded-lg flex items-start space-x-3 ${message.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <p
                        className={`text-sm ${message.type === "success" ? "text-green-800" : "text-red-800"
                            }`}
                    >
                        {message.text}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                {/* Kişisel Bilgiler */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Kişisel Bilgiler
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Ad *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Soyad *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            E-posta *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Telefon Numarası
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    {isEditing && (
                        <div>
                            <label
                                htmlFor="currentPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Mevcut Şifre *
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Şifrenizi girin"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={!isEditing}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Tarayıcı otomatik doldurmayı kapattık, lütfen elle girin.
                            </p>
                        </div>
                    )}
                </div>

                {/* Düzenleme modundayken butonlar */}
                {isEditing && (
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-lg hover:from-cyan-700 hover:to-blue-800 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            İptal
                        </button>
                    </div>
                )}
            </form>

            {/* Hesap silme */}
            <div className="mt-10 border border-red-200 bg-red-50 rounded-lg p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-700">Hesabımı sil</p>
                            <p className="text-xs text-red-600">
                                Bu işlem geri alınamaz. Lütfen dikkatli olun.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsDeleteOpen((prev) => !prev);
                            setDeleteMessage(null);
                        }}
                        className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        {isDeleteOpen ? "Kapat" : "Hesabımı Sil"}
                    </button>
                </div>

                {isDeleteOpen && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-800">
                            Hesap silme talebini göndermek için aşağıdaki cümleyi kopyalayıp
                            altındaki alana yapıştırmanız gerekiyor.
                        </p>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                            <span className="text-sm font-semibold text-red-700 select-all">
                                {deletePhrase}
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyPhrase}
                                className="ml-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <Copy className="w-4 h-4" /> Kopyala
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">
                                Doğrulama cümlesini buraya yapıştırın
                            </label>
                            <input
                                type="text"
                                value={deleteInput}
                                onChange={(e) => setDeleteInput(e.target.value)}
                                className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder={deletePhrase}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700">
                                Mevcut şifreniz
                            </label>
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Şifrenizi girin"
                                className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                            <p className="text-[11px] text-gray-500">
                                Otomatik doldurma kapalıdır, manuel şifre girişi gereklidir.
                            </p>
                        </div>

                        {deleteMessage && (
                            <div
                                className={`p-3 rounded-lg text-sm border ${deleteMessage.type === "success"
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : "bg-red-50 border-red-200 text-red-800"
                                    }`}
                            >
                                {deleteMessage.text}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Talep Gönderiliyor..." : "Hesabımı Kalıcı Sil"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteOpen(false);
                                    setDeleteInput("");
                                    setDeletePassword("");
                                    setDeleteMessage(null);
                                }}
                                className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProfileClient;
