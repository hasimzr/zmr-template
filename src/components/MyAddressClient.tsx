"use client";
import React, { useEffect, useMemo, useState } from "react";
import AddressForm from "./AddressForm";
import ConfirmDialog from "./common/ConfirmDialog";
import AddressSkeleton from "./common/AddressSkeleton";
import { useAuth } from "@/context/AuthContext";
import type { Address } from "../types";
import { Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";
import {
    myAddressesSaveApi,
    getMyAddressesApi,
    isDefaultChangeApi,
    removeAddressApi,
} from "@/Api/controllers/UserController";

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

const MyAddressClient = () => {
    const { user, isAuthenticated } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const header = useMemo(() => "Adreslerim", []);

    const getMyAddresses = async () => {
        try {
            setLoading(true);
            const res = await getMyAddressesApi();
            if (res) {
                setAddresses(res.data);
            }
        } catch (error) {
            console.error("Adresler alınamadı", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getMyAddresses();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated || !user) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{header}</h2>
                <p className="text-gray-600">
                    Adresleri görmek için lütfen giriş yapın.
                </p>
            </div>
        );
    }

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setErrors({});
    };

    const openAdd = () => {
        resetForm();
        setOpen(true);
    };

    const openEdit = (addr: Address) => {
        setEditingId(addr.id);
        setForm({
            id: addr.id,
            type: addr.type ?? "INDIVIDUAL",
            title: addr.title,
            fullName: addr.fullName,
            phone: addr.phone,
            city: addr.city,
            district: addr.district,
            neighborhood: addr.neighborhood || "",
            addressLine: addr.addressLine,
            postalCode: addr.postalCode || "",
            companyName: addr.companyName || "",
            taxOffice: addr.taxOffice || "",
            taxNumber: addr.taxNumber || "",
            isDefault: !!addr.isDefault,
        });
        setOpen(true);
    };

    const handleSubmit = async () => {
        try {
            let res = await myAddressesSaveApi(form);
            if (res) {
                setAddresses((prev) => {
                    const idx = prev.findIndex((addr) => addr.id === res.data.id);
                    let next =
                        idx !== -1
                            ? prev.map((addr, i) => (i === idx ? res.data : addr))
                            : [...prev, res.data];

                    if (res.data.isDefault) {
                        next = next.map((addr) => ({
                            ...addr,
                            isDefault: addr.id === res.data.id,
                        }));
                    }

                    return next;
                });
                setOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Adres kaydedilemedi", error);
        }
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        handleDeleteConfirmed(deleteId);
        setConfirmOpen(false);
        setDeleteId(null);
    };

    const handleDeleteConfirmed = async (id: string) => {
        try {
            let res = await removeAddressApi(id);
            if (res) {
                setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            }
        } catch (error) {
            console.error("Adres silinemedi", error);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            let res = await isDefaultChangeApi(id);
            if (res) {
                setAddresses((prev) =>
                    prev.map((addr) => ({
                        ...addr,
                        isDefault: addr.id === id,
                    }))
                );
            }
        } catch (error) {
            console.error("Varsayılan adres değiştirilemedi", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {header}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Kayıtlı teslimat ve fatura adreslerinizi yönetin
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Adres Ekle</span>
                </button>
            </div>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <AddressSkeleton key={i} />
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-6">Henüz kayıtlı adresiniz bulunmuyor.</p>
                    <button
                        onClick={openAdd}
                        className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                    >
                        İlk adresinizi şimdi ekleyin
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {addresses.map((a) => (
                        <div
                            key={a.id}
                            className={`rounded-2xl p-5 bg-white border-2 transition-all duration-300 flex flex-col gap-4 group ${a.isDefault
                                    ? "border-cyan-100 shadow-md shadow-cyan-50/50"
                                    : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {a.title}
                                        </h3>
                                        {a.isDefault && (
                                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">
                                                Varsayılan
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {a.fullName}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(a)}
                                        className="p-2 rounded-lg text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
                                        title="Düzenle"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteId(a.id);
                                            setConfirmOpen(true);
                                        }}
                                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium text-gray-800">{a.phone}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed min-h-[40px]">
                                    {a.addressLine}
                                    {a.neighborhood ? `, ${a.neighborhood}` : ""}, {a.district},{" "}
                                    {a.city} {a.postalCode}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${a.type === "CORPORATE" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                                        }`}>
                                        {a.type === "CORPORATE" ? "Kurumsal" : "Bireysel"}
                                    </span>
                                </div>
                                {!a.isDefault && (
                                    <button
                                        onClick={() => a.id && handleSetDefault(a.id)}
                                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors py-1 px-2 rounded-lg hover:bg-cyan-50"
                                    >
                                        VARSAYILAN YAP
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddressForm
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    resetForm();
                }}
                title={editingId ? "Adresi Düzenle" : "Yeni Adres Ekle"}
                submitText={editingId ? "Değişiklikleri Kaydet" : "Adresi Kaydet"}
                showDefaultCheckbox={true}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                errors={errors}
            />

            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
                title="Adresi Sil"
                message="Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
                confirmText="Sil"
                cancelText="İptal"
                variant="danger"
            />
        </div>
    );
};

export default MyAddressClient;
