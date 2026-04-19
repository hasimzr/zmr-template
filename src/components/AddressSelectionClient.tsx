"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getMyAddressesApi,
    myAddressesSaveApi,
} from "@/Api/controllers/UserController";
import type { Address } from "../types";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";
import ModalComponent from "./ModalCompanent";
import AddressForm from "./AddressForm";

interface AddressSelectionClientProps {
    onComplete: (selectedAddress: Address) => void;
    orderData?: {
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
    };
    addresses: Address[];
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
    selectedAddress: Address | null;
    setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
    initialAddresses?: Address[];
}

type FormState = Omit<Address, "userId"> & { id?: string | null };

const emptyForm: FormState = {
    type: "INDIVIDUAL",
    title: "",
    id: null,
    fullName: "",
    phone: "",
    city: "",
    district: "",
    neighborhood: "",
    addressLine: "",
    postalCode: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    isDefault: false,
};

const AddressSelectionClient = ({
    onComplete,
    orderData,
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    initialAddresses,
}: AddressSelectionClientProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(!initialAddresses);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const getMyAddresses = async () => {
        try {
            setLoading(true);
            const res = await getMyAddressesApi();
            if (res) {
                setAddresses(res.data);
                // Varsayılan adresi seç
                const defaultAddr = res.data.find((addr: Address) => addr.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr);
                } else if (res.data.length > 0) {
                    setSelectedAddress(res.data[0]);
                }
            }
        } catch (error) {
            console.error("Adresler alınamadı", error);
        } finally {
            setLoading(false);
        }
    };

    // İlk yükleme ve user durumuna göre adresleri ayarla
    useEffect(() => {
        if (initialAddresses) {
            setAddresses(initialAddresses);
            setLoading(false);
        } else if (user) {
            getMyAddresses();
        } else {
            setLoading(false);
        }
    }, [user, initialAddresses]);

    // Kullanıcı giriş yapmışsa ve parent seçili adres göndermişse fetch sonrası eşleştir
    useEffect(() => {
        if (user && selectedAddress && addresses.length > 0) {
            const match = addresses.find((a) => a.id === selectedAddress.id);
            if (match && match !== selectedAddress) {
                setSelectedAddress(match);
            }
        }
    }, [user, selectedAddress, addresses]);

    const openAddModal = () => {
        setForm({
            ...emptyForm,
            fullName:
                orderData?.firstName && orderData?.lastName
                    ? `${orderData.firstName} ${orderData.lastName}`
                    : user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "",
            phone: orderData?.phone || "",
        });
        setShowAddModal(true);
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "Zorunlu";
        if (!form.fullName.trim()) e.fullName = "Zorunlu";
        if (!form.phone.trim()) e.phone = "Zorunlu";
        if (!form.city.trim()) e.city = "Zorunlu";
        if (!form.district.trim()) e.district = "Zorunlu";
        if (!form.addressLine.trim()) e.addressLine = "Zorunlu";
        if (form.type === "CORPORATE") {
            if (!form.companyName?.trim()) e.companyName = "Zorunlu";
            if (!form.taxOffice?.trim()) e.taxOffice = "Zorunlu";
            if (!form.taxNumber?.trim()) e.taxNumber = "Zorunlu";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitNewAddress = async () => {
        if (!validate()) return;

        try {
            if (user) {
                const res = await myAddressesSaveApi(form);
                if (res) {
                    setAddresses((prev) => [...prev, res.data]);
                    setSelectedAddress(res.data);
                    setShowAddModal(false);
                    setForm(emptyForm);
                    setErrors({});
                }
            } else {
                const newAddress: Address = {
                    ...form,
                    id: `temp-${Date.now()}`,
                    userId: 0,
                };
                setAddresses((prev) => [...prev, newAddress]);
                setSelectedAddress(newAddress);
                setShowAddModal(false);
                setForm(emptyForm);
                setErrors({});
            }
        } catch (error) {
            console.error("Adres eklenemedi", error);
        }
    };

    const handleContinue = () => {
        if (selectedAddress) {
            onComplete(selectedAddress);
        }
    };

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-cyan-600" />
                            Teslimat Adresi
                        </h2>
                        <p className="text-sm text-gray-600 mt-1.5">
                            {user
                                ? "Siparişinizin teslim edileceği adresi seçin veya yeni adres ekleyin"
                                : "Siparişinizin teslim edileceği adresi ekleyin"}
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">
                            {addresses.length > 0 ? "Yeni Adres" : "Adres Ekle"}
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-gray-100 rounded-lg h-32"
                            />
                        ))}
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                            {user
                                ? "Henüz kayıtlı adresiniz yok"
                                : "Teslimat için adres bilgisi gerekiyor"}
                        </p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-medium transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {user ? "İlk Adresimi Ekle" : "Adres Ekle"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddress(addr)}
                                    className={`relative p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedAddress?.id === addr.id
                                        ? "border-cyan-500 bg-cyan-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                        }`}
                                >
                                    {selectedAddress?.id === addr.id && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-6 h-6 text-cyan-600" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 mb-3">
                                        <MapPin
                                            className={`w-5 h-5 shrink-0 mt-0.5 ${selectedAddress?.id === addr.id
                                                ? "text-cyan-600"
                                                : "text-gray-400"
                                                }`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3
                                                    className={`font-semibold text-lg ${selectedAddress?.id === addr.id
                                                        ? "text-cyan-900"
                                                        : "text-gray-900"
                                                        }`}
                                                >
                                                    {addr.title}
                                                </h3>
                                                {addr.isDefault && (
                                                    <span className="text-xs font-medium text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-200">
                                                        Varsayılan
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={`text-sm mb-2 ${selectedAddress?.id === addr.id
                                                    ? "text-cyan-800 font-medium"
                                                    : "text-gray-700"
                                                    }`}
                                            >
                                                {addr.fullName} • {addr.phone}
                                            </div>
                                            <p
                                                className={`text-sm leading-relaxed ${selectedAddress?.id === addr.id
                                                    ? "text-cyan-700"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {addr.addressLine}
                                                {addr.neighborhood && `, ${addr.neighborhood}`},{" "}
                                                {addr.district}, {addr.city}
                                                {addr.postalCode && ` ${addr.postalCode}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t hidden lg:block">
                            <button
                                onClick={handleContinue}
                                disabled={!selectedAddress}
                                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${selectedAddress
                                    ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <span>
                                    {selectedAddress
                                        ? "Bu Adrese Gönder"
                                        : "Lütfen bir adres seçin"}
                                </span>
                                {selectedAddress && (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden">
                <button
                    onClick={handleContinue}
                    disabled={!selectedAddress}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${selectedAddress
                        ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md active:scale-[0.98]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    <span>
                        {selectedAddress ? "Bu Adrese Gönder" : "Lütfen bir adres seçin"}
                    </span>
                    {selectedAddress && (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    )}
                </button>
            </div>

            <AddressForm
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setForm(emptyForm);
                    setErrors({});
                }}
                onSubmit={handleSubmitNewAddress}
                form={form}
                setForm={setForm}
                errors={errors}
            />
        </div>
    );
};

export default AddressSelectionClient;
