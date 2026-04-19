"use client";
import React, { useRef } from "react";
import type { Address } from "../types";
import ModalComponent from "./ModalCompanent";

interface AddressFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    form: Omit<Address, "userId"> & { id?: string | null };
    setForm: React.Dispatch<React.SetStateAction<Omit<Address, "userId"> & { id?: string | null }>>;
    errors: Record<string, string>;
    title?: string;
    submitText?: string;
    showDefaultCheckbox?: boolean;
}

const AddressForm = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    errors,
    title = "Yeni Teslimat Adresi",
    submitText = "Adresi Kaydet",
    showDefaultCheckbox = false,
}: AddressFormProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (formRef.current && !formRef.current.reportValidity()) return;
        onSubmit();
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
            closeOnOverlayClick={false}
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleFormSubmit}
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white shadow-sm transition-all duration-200"
                    >
                        {submitText}
                    </button>
                </div>
            }
        >
            <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres Başlığı <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.title}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${errors.title ? "border-red-400" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        placeholder="Ev, İş..."
                        required
                        autoComplete="off"
                    />
                    {errors.title && (
                        <p className="text-xs text-red-600 mt-1">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.fullName}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, fullName: e.target.value }))
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? "border-red-400" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        placeholder="Ad Soyad"
                        required
                        autoComplete="name"
                    />
                    {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                        Adres Türü
                    </span>
                    <div className="flex items-center gap-3">
                        <label
                            className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer select-none transition-all duration-200 ${form.type === "INDIVIDUAL"
                                ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                                : "border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="radio"
                                name="addrType"
                                value="INDIVIDUAL"
                                checked={form.type === "INDIVIDUAL"}
                                className="w-4 h-4 text-cyan-600 pointer-events-none"
                                onChange={() =>
                                    setForm((f) => ({ ...f, type: "INDIVIDUAL" }))
                                }
                            />
                            <span className="text-sm font-medium">Bireysel</span>
                        </label>
                        <label
                            className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer select-none transition-all duration-200 ${form.type === "CORPORATE"
                                ? "border-cyan-500 bg-cyan-50 text-cyan-800"
                                : "border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="radio"
                                name="addrType"
                                value="CORPORATE"
                                checked={form.type === "CORPORATE"}
                                className="w-4 h-4 text-cyan-600 pointer-events-none"
                                onChange={() => setForm((f) => ({ ...f, type: "CORPORATE" }))}
                            />
                            <span className="text-sm font-medium">Kurumsal</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.phone}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? "border-red-400" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        placeholder="05xx xxx xx xx"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                    />
                    {errors.phone && (
                        <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.city}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.city ? "border-red-400" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        placeholder="Şehir"
                        required
                        autoComplete="address-level1"
                    />
                    {errors.city && (
                        <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        İlçe <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.district}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, district: e.target.value }))
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${errors.district ? "border-red-400" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        placeholder="İlçe"
                        required
                        autoComplete="address-level2"
                    />
                    {errors.district && (
                        <p className="text-xs text-red-600 mt-1">{errors.district}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mahalle (opsiyonel)
                    </label>
                    <input
                        value={form.neighborhood}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, neighborhood: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="Mahalle"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={form.addressLine}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, addressLine: e.target.value }))
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${errors.addressLine ? "border-red-400" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        rows={3}
                        required
                        placeholder="Sokak/Cadde, No, Daire vs."
                        autoComplete="street-address"
                    />
                    {errors.addressLine && (
                        <p className="text-xs text-red-600 mt-1">{errors.addressLine}</p>
                    )}
                </div>

                {form.type === "CORPORATE" && (
                    <>
                        <div className="sm:col-span-2 mt-2 pt-2 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Fatura Bilgileri
                            </h4>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Firma Ünvanı <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.companyName}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, companyName: e.target.value }))
                                }
                                className={`w-full px-4 py-2 rounded-lg border ${errors.companyName ? "border-red-400" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                                placeholder="Şirket adı"
                                required={form.type === "CORPORATE"}
                            />
                            {errors.companyName && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.companyName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vergi Dairesi <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.taxOffice}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, taxOffice: e.target.value }))
                                }
                                className={`w-full px-4 py-2 rounded-lg border ${errors.taxOffice ? "border-red-400" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                                placeholder="Vergi dairesi"
                                required={form.type === "CORPORATE"}
                            />
                            {errors.taxOffice && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.taxOffice}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vergi Numarası <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.taxNumber}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, taxNumber: e.target.value }))
                                }
                                className={`w-full px-4 py-2 rounded-lg border ${errors.taxNumber ? "border-red-400" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                                placeholder="Vergi numarası"
                                inputMode="numeric"
                                required={form.type === "CORPORATE"}
                            />
                            {errors.taxNumber && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errors.taxNumber}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posta Kodu (opsiyonel)
                    </label>
                    <input
                        value={form.postalCode}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, postalCode: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="00000"
                        inputMode="numeric"
                        autoComplete="postal-code"
                    />
                </div>

                {showDefaultCheckbox && (
                    <div className="flex items-center gap-2 sm:col-span-2 mt-1">
                        <input
                            id="isDefault"
                            type="checkbox"
                            checked={!!form.isDefault}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, isDefault: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer select-none">
                            Varsayılan adres yap
                        </label>
                    </div>
                )}
            </form>
        </ModalComponent>
    );
};

export default AddressForm;
