"use client";

import { User, Mail, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/ModalCompanent";
import ImageCropper from "@/components/common/ImageCropper";
import { updateUserAvatarApi } from "@/Api/controllers/UserController";
import MyAddress from "@/components/MyAddress";
import MyOrders from "@/components/MyOrders";
import MyFavorites from "@/components/MyFavorites";
import MyProfile from "@/components/MyProfile";
import { getFileUrl } from "@/utils/file";
import Link from "next/link";

interface DashboardClientProps {
    initialTab: string;
}

const DashboardClient = ({ initialTab }: DashboardClientProps) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const activeTab = initialTab;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Giriş yapılmamışsa login sayfasına yönlendir
    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 mb-4">Lütfen giriş yapın.</p>
                <Link
                    href="/login"
                    className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                    Giriş Yap
                </Link>
            </div>
        );
    }

    // Resim seçildiğinde
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const blobToFile = (theBlob: Blob, fileName: string): File => {
        return new File([theBlob], fileName, { type: theBlob.type });
    };

    // Kırpma tamamlandığında
    const handleCropComplete = async (
        croppedImageBlob: Blob,
        _croppedImageUrl: string
    ) => {
        setIsUploading(true);
        try {
            // FormData ile resmi backend'e gönder
            const formData = new FormData();
            formData.append("file", blobToFile(croppedImageBlob, "avatar.png"));

            // Örnek: /api/users/:id/avatar endpointine gönderim
            const response = await updateUserAvatarApi(formData);
            if (response) {
                const currentUser = localStorage.getItem("currentUser");
                if (currentUser) {
                    let userData = JSON.parse(currentUser);
                    userData.avatar = response.data;
                    localStorage.setItem("currentUser", JSON.stringify(userData));
                    window.location.reload();
                }
            }

            setSelectedImage(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Profil resmi güncellenirken hata oluştu:", error);
            alert("Profil resmi güncellenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    // Modal kapatıldığında
    const handleModalClose = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kullanıcı Bilgileri */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                {user.avatar ? (
                                    <img
                                        src={getFileUrl(user.avatar)}
                                        alt={user.firstName + " " + user.lastName}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-gray-50"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-cyan-100 ring-4 ring-gray-50">
                                        <User className="w-10 h-10 sm:w-12 sm:h-12" />
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-4 right-0 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white rounded-full p-2 shadow-lg transition transform hover:scale-105"
                                    title="Profil resmini değiştir"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {user.firstName + " " + user.lastName}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-700 bg-gray-50 p-3 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-sm sm:text-base break-all">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İçerik alanı: Sekmeli menü */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
                            <nav className="flex min-w-full px-4 sm:px-6" aria-label="Tabs">
                                <div className="flex gap-6 sm:gap-8">
                                    <button
                                        onClick={() => router.push("/dashboard?tab=orders")}
                                        className={`whitespace-nowrap py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "orders"
                                                ? "border-cyan-600 text-cyan-600"
                                                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                            }`}
                                    >
                                        Siparişlerim
                                    </button>
                                    <button
                                        onClick={() => router.push("/dashboard?tab=addresses")}
                                        className={`whitespace-nowrap py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "addresses"
                                                ? "border-cyan-600 text-cyan-600"
                                                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                            }`}
                                    >
                                        Adreslerim
                                    </button>
                                    <button
                                        onClick={() => router.push("/dashboard?tab=favorites")}
                                        className={`whitespace-nowrap py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "favorites"
                                                ? "border-cyan-600 text-cyan-600"
                                                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                            }`}
                                    >
                                        Favorilerim
                                    </button>
                                    <button
                                        onClick={() => router.push("/dashboard?tab=profile")}
                                        className={`whitespace-nowrap py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "profile"
                                                ? "border-cyan-600 text-cyan-600"
                                                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                            }`}
                                    >
                                        Profil Bilgilerim
                                    </button>
                                </div>
                            </nav>
                        </div>

                        <div className="p-4 sm:p-6">
                            {activeTab === "orders" && <MyOrders />}
                            {activeTab === "addresses" && <MyAddress />}
                            {activeTab === "favorites" && <MyFavorites />}
                            {activeTab === "profile" && <MyProfile />}
                        </div>
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedImage ? "Profil Resmini Kırp" : "Profil Resmi"}
            >
                {selectedImage ? (
                    <ImageCropper
                        imageSrc={selectedImage}
                        onCropComplete={handleCropComplete}
                        onCancel={handleModalClose}
                        isLoading={isUploading}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Profil resmi seçilmedi</p>
                    </div>
                )}
            </ModalComponent>
        </>
    );
};

export default DashboardClient;
