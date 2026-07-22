"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ModalComponent from "./ModalCompanent";
import {
    PRELIMINARY_INFORMATION_FORM,
    DISTANCE_SALES_AGREEMENT,
    KVKK_TEXT,
} from "@/data/contracts";
import {
    CreditCard,
    Lock,
    Calendar,
    User,
    Banknote,
    Wallet,
    ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getPaymentOptionsApi } from "@/Api/controllers/OrderController";
import type { PaymentOptions, PaymentMethodType, BankAccount } from "../types";

interface CreditCartClientProps {
    onComplete: (paymentInfo: PaymentInfo) => void | Promise<void>;
    orderData?: {
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
    };
    paymentInfo?: PaymentInfo;
}

export interface PaymentInfo {
    paymentMethod: PaymentMethodType;
    provider?: "iyzico" | "paytr" | string;
    // Kredi kartı bilgileri
    cardNumber?: string;
    cardHolder?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    // Banka transferi için
    selectedBank?: BankAccount;
}

const CreditCartClient = ({
    onComplete,
    orderData,
    paymentInfo,
}: CreditCartClientProps) => {
    const { cartItems } = useCart();
    const [paymentOptions, setPaymentOptions] = useState<PaymentOptions | null>(
        null
    );
    const [selectedMethod, setSelectedMethod] =
        useState<PaymentMethodType | null>(paymentInfo?.paymentMethod || null);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [kvkkAccepted, setKvkkAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showKvkkModal, setShowKvkkModal] = useState(false);

    const [siteName, setSiteName] = useState("Zmrelektronik");
    const [domain, setDomain] = useState("zmrelektronik.com");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDomain(window.location.host);
        }
        const fetchLogoAndName = async () => {
            try {
                const { getLogoAndNameApi } = await import("@/Api/controllers/ThemeController");
                const res = await getLogoAndNameApi();
                if (res?.data?.SiteNamePrimaryTitle) {
                    setSiteName(res.data.SiteNamePrimaryTitle);
                }
            } catch (e) {
                // ignore
            }
        };
        fetchLogoAndName();
    }, []);

    const replaceBrandDetails = (text: string) => {
        if (!text) return "";
        return text
            .replace(/zmrelektronik\.com/gi, domain)
            .replace(/Zmrelektronik/gi, siteName)
            .replace(/ZmrElektronik/gi, siteName)
            .replace(/ZMR Elektronik/gi, siteName);
    };

    const displayPreliminaryForm = replaceBrandDetails(PRELIMINARY_INFORMATION_FORM);
    const displayDistanceSalesAgreement = replaceBrandDetails(DISTANCE_SALES_AGREEMENT);
    const displayKvkkText = replaceBrandDetails(KVKK_TEXT);

    const [form, setForm] = useState<PaymentInfo>({
        paymentMethod: paymentInfo?.paymentMethod || "creditCard",
        cardNumber: paymentInfo?.cardNumber || "",
        cardHolder: paymentInfo?.cardHolder
            ? paymentInfo.cardHolder
            : orderData?.firstName && orderData?.lastName
                ? `${orderData.firstName} ${orderData.lastName}`
                : "",
        expiryMonth: paymentInfo?.expiryMonth || "",
        expiryYear: paymentInfo?.expiryYear || "",
        cvv: paymentInfo?.cvv || "",
        selectedBank: paymentInfo?.selectedBank || undefined,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof PaymentInfo, string>>
    >({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Ödeme seçeneklerini yükle
    useEffect(() => {
        const fetchPaymentOptions = async () => {
            try {
                setIsLoadingOptions(true);
                const stringList = cartItems.map((item) => item.product.id);
                console.log("stringList ==> ", stringList);

                const response = await getPaymentOptionsApi(stringList);
                setPaymentOptions(response.data);

                // Eğer sadece bir ödeme yöntemi varsa otomatik seç
                const availableMethods: PaymentMethodType[] = [];
                if (response.data.creditCard?.enabled)
                    availableMethods.push("creditCard");
                if (response.data.cashOnDelivery)
                    availableMethods.push("cashOnDelivery");
                if (response.data.bankTransfer?.enabled)
                    availableMethods.push("bankTransfer");

                if (availableMethods.length === 1 && !selectedMethod) {
                    setSelectedMethod(availableMethods[0]);
                    setForm({ ...form, paymentMethod: availableMethods[0] });
                }
            } catch (error) {
                console.error("Ödeme seçenekleri yüklenirken hata:", error);
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchPaymentOptions();
    }, [cartItems]);

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, "");
        const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
        return formatted;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, "");
        if (value.length <= 16 && /^\d*$/.test(value)) {
            setForm({ ...form, cardNumber: value });
            if (errors.cardNumber) {
                setErrors({ ...errors, cardNumber: "" });
            }
        }
    };

    const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({ ...form, cardHolder: value });
        if (errors.cardHolder) {
            setErrors({ ...errors, cardHolder: "" });
        }
    };

    const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Sadece rakam kabul et
        if (!/^\d*$/.test(value)) return;

        // İki karakterden fazla izin verme
        if (value.length > 2) return;

        // Boş ise direkt set et
        if (value === "") {
            setForm({ ...form, expiryMonth: "" });
            if (errors.expiryMonth) {
                setErrors({ ...errors, expiryMonth: "" });
            }
            return;
        }

        const numValue = parseInt(value);

        // Tek karakter
        if (value.length === 1) {
            // 0 yazıldıysa kabul et (02 gibi olabilir)
            if (value === "0") {
                setForm({ ...form, expiryMonth: "0" });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
                return;
            }

            // 1 yazıldıysa bekle (10, 11, 12 olabilir)
            if (value === "1") {
                setForm({ ...form, expiryMonth: "1" });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
                return;
            }

            // 2-9 arası ise otomatik olarak başına 0 ekle
            if (numValue >= 2 && numValue <= 9) {
                setForm({ ...form, expiryMonth: `0${value}` });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
                return;
            }
        }

        // İki karakter - 01-12 arası kontrol
        if (value.length === 2) {
            if (numValue >= 1 && numValue <= 12) {
                setForm({ ...form, expiryMonth: value });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
            }
        }
    };

    const handleExpiryMonthBlur = () => {
        // Input'tan çıkıldığında tek haneli ise başına 0 ekle
        const month = form.expiryMonth ?? "";
        if (month.length === 1) {
            const numValue = parseInt(month, 10);
            if (!Number.isNaN(numValue) && numValue >= 1 && numValue <= 9) {
                setForm({ ...form, expiryMonth: `0${month}` });
            }
        }
    };

    const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 2 && /^\d*$/.test(value)) {
            setForm({ ...form, expiryYear: value });
            if (errors.expiryYear) {
                setErrors({ ...errors, expiryYear: "" });
            }
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 3 && /^\d*$/.test(value)) {
            setForm({ ...form, cvv: value });
            if (errors.cvv) {
                setErrors({ ...errors, cvv: "" });
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PaymentInfo, string>> = {};

        // Ödeme yöntemi seçilmemişse
        if (!selectedMethod) {
            toast.error("Lütfen bir ödeme yöntemi seçin");
            return false;
        }

        // Sözleşme ve KVKK kontrolü
        if (!termsAccepted || !kvkkAccepted) {
            toast.error("Lütfen Ön Bilgilendirme Formu, Mesafeli Satış Sözleşmesi ve KVKK Aydınlatma Metni'ni onaylayın.");
            return false;
        }

        // Kredi kartı seçildiyse kart bilgilerini kontrol et
        if (selectedMethod === "creditCard") {
            const provider = paymentOptions?.creditCard?.provider;
            // Sağlayıcı iyzico veya paytr ise iframe/form kullanılacağından manuel kart alanı doğrulamasını atla
            if (provider !== "iyzico" && provider !== "paytr") {
                // Kart numarası kontrolü
                if (!form.cardNumber) {
                    newErrors.cardNumber = "Kart numarası gerekli";
                } else if (form.cardNumber.length !== 16) {
                    newErrors.cardNumber = "Kart numarası 16 haneli olmalıdır";
                }

                // Kart sahibi kontrolü
                if (!form.cardHolder?.trim()) {
                    newErrors.cardHolder = "Kart sahibi adı gerekli";
                } else if (form.cardHolder.trim().length < 3) {
                    newErrors.cardHolder = "Geçerli bir ad soyad girin";
                }

                // Ay kontrolü
                if (!form.expiryMonth) {
                    newErrors.expiryMonth = "Ay gerekli";
                } else {
                    const month = parseInt(form.expiryMonth);
                    if (month < 1 || month > 12) {
                        newErrors.expiryMonth = "Geçersiz ay";
                    }
                }

                // Yıl kontrolü
                if (!form.expiryYear) {
                    newErrors.expiryYear = "Yıl gerekli";
                } else {
                    const currentYear = new Date().getFullYear() % 100;
                    const year = parseInt(form.expiryYear);
                    if (year < currentYear) {
                        newErrors.expiryYear = "Kartın süresi dolmuş";
                    }
                }

                // CVV kontrolü
                if (!form.cvv) {
                    newErrors.cvv = "CVV gerekli";
                } else if (form.cvv.length !== 3) {
                    newErrors.cvv = "CVV 3 haneli olmalıdır";
                }
            }
        }

        // Banka transferi seçildiyse banka hesabı seçimi kontrol et
        if (selectedMethod === "bankTransfer" && !form.selectedBank) {
            alert("Lütfen bir banka hesabı seçin");
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        const provider = paymentOptions?.creditCard?.provider;
        const paymentData: PaymentInfo = {
            paymentMethod: selectedMethod!,
            provider: provider,
            ...(selectedMethod === "creditCard" && provider !== "iyzico" && provider !== "paytr" && {
                cardNumber: form.cardNumber,
                cardHolder: form.cardHolder,
                expiryMonth: form.expiryMonth,
                expiryYear: form.expiryYear,
                cvv: form.cvv,
            }),
            ...(selectedMethod === "bankTransfer" && {
                selectedBank: form.selectedBank,
            }),
        };

        try {
            await onComplete(paymentData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const getCardType = (number: string) => {
        if (!number) return null;
        const firstDigit = number[0];
        if (firstDigit === "4") return "VISA";
        if (firstDigit === "5") return "MASTERCARD";
        if (firstDigit === "3") return "AMEX";
        return "CARD";
    };

    const renderContractCheckboxes = () => (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 my-4 space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                Sözleşmeler ve Yasal Onaylar
            </h4>

            <div className="flex items-start gap-3">
                <div className="flex items-center h-5 mt-0.5">
                    <input
                        id="credit-terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-4 h-4 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    />
                </div>
                <label htmlFor="credit-terms" className="text-xs sm:text-sm text-gray-700 select-none">
                    <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-cyan-600 hover:text-cyan-800 underline font-medium cursor-pointer text-left"
                    >
                        Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi
                    </button>
                    'ni okudum, onaylıyorum. <span className="text-red-500">*</span>
                </label>
            </div>

            <div className="flex items-start gap-3">
                <div className="flex items-center h-5 mt-0.5">
                    <input
                        id="credit-kvkk"
                        type="checkbox"
                        checked={kvkkAccepted}
                        onChange={(e) => setKvkkAccepted(e.target.checked)}
                        className="w-4 h-4 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                    />
                </div>
                <label htmlFor="credit-kvkk" className="text-xs sm:text-sm text-gray-700 select-none">
                    <button
                        type="button"
                        onClick={() => setShowKvkkModal(true)}
                        className="text-cyan-600 hover:text-cyan-800 underline font-medium cursor-pointer text-left"
                    >
                        KVKK Aydınlatma Metni
                    </button>
                    'ni okudum. <span className="text-red-500">*</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 p-3 rounded-xl">
                        <Wallet className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Ödeme Yöntemi Seçin 💳
                        </h2>
                        <p className="text-sm text-gray-600">
                            Size uygun ödeme yöntemini seçerek devam edin
                        </p>
                    </div>
                </div>

                {/* Güvenlik Uyarısı */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-r-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-green-800">
                                🔒 256-bit SSL ile Güvenli Ödeme
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                                Ödeme bilgileriniz şifrelenerek güvenli bir şekilde iletilir
                            </p>
                        </div>
                    </div>
                </div>

                {isLoadingOptions ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-gray-600">
                            Ödeme seçenekleri yükleniyor...
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Ödeme Yöntemi Seçim Kartları */}
                        <div className="space-y-4 mb-6">
                            {/* Kredi Kartı */}
                            {paymentOptions?.creditCard?.enabled && (
                                <div
                                    onClick={() => {
                                        setSelectedMethod("creditCard");
                                        setForm({ ...form, paymentMethod: "creditCard" });
                                    }}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === "creditCard"
                                        ? "border-cyan-600 bg-cyan-50 shadow-md"
                                        : "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === "creditCard"
                                                ? "border-cyan-600 bg-cyan-600"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {selectedMethod === "creditCard" && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-cyan-600" />
                                                <h3 className="font-semibold text-gray-900">
                                                    Kredi Kartı / Banka Kartı
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Visa, MasterCard, American Express, Troy
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-12 h-8 bg-cyan-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                                VISA
                                            </div>
                                            <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                                MC
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kapıda Ödeme */}
                            {paymentOptions?.cashOnDelivery && (
                                <div
                                    onClick={() => {
                                        setSelectedMethod("cashOnDelivery");
                                        setForm({ ...form, paymentMethod: "cashOnDelivery" });
                                    }}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === "cashOnDelivery"
                                        ? "border-green-600 bg-green-50 shadow-md"
                                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === "cashOnDelivery"
                                                ? "border-green-600 bg-green-600"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {selectedMethod === "cashOnDelivery" && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Banknote className="w-5 h-5 text-green-600" />
                                                <h3 className="font-semibold text-gray-900">
                                                    Kapıda Ödeme
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Nakit veya kredi kartı ile kapıda ödeme yapabilirsiniz
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Banka Transferi / EFT / Havale */}
                            {paymentOptions?.bankTransfer?.enabled && (
                                <div
                                    onClick={() => {
                                        setSelectedMethod("bankTransfer");
                                        setForm({ ...form, paymentMethod: "bankTransfer" });
                                    }}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === "bankTransfer"
                                        ? "border-purple-600 bg-purple-50 shadow-md"
                                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === "bankTransfer"
                                                ? "border-purple-600 bg-purple-600"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {selectedMethod === "bankTransfer" && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-purple-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                                    />
                                                </svg>
                                                <h3 className="font-semibold text-gray-900">
                                                    Banka Transferi / EFT / Havale
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Banka hesabımıza havale/EFT ile ödeme yapabilirsiniz
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Kredi Kartı Formu / Sağlayıcı Bilgisi */}
                        {selectedMethod === "creditCard" && (
                            <div className="border-t pt-6">
                                {(paymentOptions?.creditCard?.provider === "iyzico" || paymentOptions?.creditCard?.provider === "paytr") ? (
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg uppercase">
                                                        {paymentOptions.creditCard.provider} Güvenli Ödeme Altyapısı
                                                    </h4>
                                                    <p className="text-xs text-cyan-700 font-medium">256-bit SSL Şifreli Kart İframe / Checkout Formu</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                Siparişinizi onayladıktan sonra kart bilgilerinizi bankanızın 3D Secure onay ekranı ile <strong>{paymentOptions.creditCard.provider.toUpperCase()}</strong> güvenli ödeme formunda gireceksiniz.
                                            </p>
                                        </div>

                                            {renderContractCheckboxes()}

                                            <button
                                                type="button"
                                                onClick={() => handleSubmit()}
                                                disabled={isProcessing || !termsAccepted || !kvkkAccepted}
                                                className={`w-full py-4 rounded-xl font-semibold text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-xl hidden lg:flex ${isProcessing || !termsAccepted || !kvkkAccepted
                                                    ? "bg-gray-400 cursor-not-allowed opacity-75"
                                                    : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
                                                    }`}
                                            >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>İşlem Yapılıyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-5 h-5" />
                                                    <span>Güvenli Ödeme Bağlantısı Oluştur</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-cyan-600" />
                                            Kart Bilgilerinizi Girin
                                        </h3>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Kart Numarası */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                                    Kart Numarası <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <CreditCard className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formatCardNumber(form.cardNumber || "")}
                                                        onChange={handleCardNumberChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        className={`w-full px-4 py-3.5 pl-12 pr-20 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm ${errors.cardNumber
                                                            ? "border-red-500 bg-red-50"
                                                            : "border-gray-200 bg-gray-50 focus:bg-white"
                                                            }`}
                                                    />
                                                    {form.cardNumber && form.cardNumber.length > 0 && (
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-3 py-1.5 rounded-md text-xs font-bold text-white shadow-sm">
                                                                {getCardType(form.cardNumber)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                {errors.cardNumber && (
                                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.cardNumber}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Kart Sahibi */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                                    Kart Üzerindeki İsim{" "}
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <User className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={form.cardHolder || ""}
                                                        onChange={handleCardHolderChange}
                                                        placeholder="Ad Soyad"
                                                        className={`w-full px-4 py-3.5 pl-12 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm ${errors.cardHolder
                                                            ? "border-red-500 bg-red-50"
                                                            : "border-gray-200 bg-gray-50 focus:bg-white"
                                                            }`}
                                                    />
                                                </div>
                                                {errors.cardHolder && (
                                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.cardHolder}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Son Kullanma Tarihi ve CVV */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Son Kullanma Tarihi */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                                        Son Kullanma Tarihi{" "}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex gap-3 items-center">
                                                        <div className="relative flex-1">
                                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={form.expiryMonth || ""}
                                                                onChange={handleExpiryMonthChange}
                                                                onBlur={handleExpiryMonthBlur}
                                                                placeholder="AA"
                                                                maxLength={2}
                                                                className={`w-full px-4 py-3.5 pl-10 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm text-center ${errors.expiryMonth
                                                                    ? "border-red-500 bg-red-50"
                                                                    : "border-gray-200 bg-gray-50 focus:bg-white"
                                                                    }`}
                                                            />
                                                        </div>
                                                        <span className="text-2xl text-gray-300 font-bold">
                                                            /
                                                        </span>
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={form.expiryYear || ""}
                                                                onChange={handleExpiryYearChange}
                                                                placeholder="YY"
                                                                maxLength={2}
                                                                className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm text-center ${errors.expiryYear
                                                                    ? "border-red-500 bg-red-50"
                                                                    : "border-gray-200 bg-gray-50 focus:bg-white"
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>
                                                    {(errors.expiryMonth || errors.expiryYear) && (
                                                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            {errors.expiryMonth || errors.expiryYear}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* CVV */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                                        CVV/CVC <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <Lock className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="password"
                                                            value={form.cvv || ""}
                                                            onChange={handleCvvChange}
                                                            placeholder="123"
                                                            maxLength={3}
                                                            className={`w-full px-4 py-3.5 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm ${errors.cvv
                                                                ? "border-red-500 bg-red-50"
                                                                : "border-gray-200 bg-gray-50 focus:bg-white"
                                                                }`}
                                                        />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 group">
                                                            <div className="w-6 h-6 border-2 border-cyan-400 rounded-full flex items-center justify-center text-xs font-bold text-cyan-600 cursor-help hover:bg-cyan-50 transition">
                                                                ?
                                                            </div>
                                                            <div className="hidden group-hover:block absolute right-0 top-10 w-56 bg-gray-900 text-white text-xs p-3 rounded-xl z-10 shadow-xl">
                                                                <div className="font-semibold mb-1">CVV Nedir?</div>
                                                                Kartınızın arkasındaki 3 haneli güvenlik kodu
                                                                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {errors.cvv && (
                                                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            {errors.cvv}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {renderContractCheckboxes()}

                                            {/* Ödeme Butonu */}
                                            <button
                                                type="submit"
                                                disabled={isProcessing || !termsAccepted || !kvkkAccepted}
                                                className={`w-full py-4 rounded-xl font-semibold text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-xl hidden lg:flex ${isProcessing || !termsAccepted || !kvkkAccepted
                                                    ? "bg-gray-400 cursor-not-allowed opacity-75"
                                                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98]"
                                                    }`}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>İşlem Yapılıyor...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-5 h-5" />
                                                        <span>Güvenli Ödeme Yap</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Kabul Edilen Kartlar */}
                                            <div className="pt-6 border-t">
                                                <p className="text-sm text-gray-600 text-center mb-4 font-medium">
                                                    Kabul Edilen Kartlar
                                                </p>
                                                <div className="flex justify-center items-center gap-3">
                                                    <div className="w-16 h-11 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg transition transform hover:scale-105">
                                                        VISA
                                                    </div>
                                                    <div className="w-16 h-11 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg transition transform hover:scale-105">
                                                        MC
                                                    </div>
                                                    <div className="w-16 h-11 bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg transition transform hover:scale-105">
                                                        AMEX
                                                    </div>
                                                    <div className="w-16 h-11 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md hover:shadow-lg transition transform hover:scale-105">
                                                        TROY
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Banka Transferi İçin Banka Hesap Seçimi */}
                        {selectedMethod === "bankTransfer" &&
                            paymentOptions?.bankTransfer?.accounts && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                            />
                                        </svg>
                                        Banka Hesabı Seçin
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        {paymentOptions.bankTransfer.accounts.map(
                                            (account, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        setForm({ ...form, selectedBank: account })
                                                    }
                                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${form.selectedBank === account
                                                        ? "border-purple-600 bg-purple-50 shadow-md"
                                                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${form.selectedBank === account
                                                                ? "border-purple-600 bg-purple-600"
                                                                : "border-gray-300"
                                                                }`}
                                                        >
                                                            {form.selectedBank === account && (
                                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {account.bankName}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                <span className="font-medium">
                                                                    Hesap Sahibi:
                                                                </span>{" "}
                                                                {account.accountHolder}
                                                            </p>
                                                            <p className="text-sm text-gray-600 font-mono mt-1 break-all">
                                                                <span className="font-medium">IBAN:</span>{" "}
                                                                {account.iban}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {renderContractCheckboxes()}

                                    {/* Ödeme Butonu (Banka Transferi) */}
                                    <button
                                        onClick={() => handleSubmit()}
                                        disabled={isProcessing || !form.selectedBank || !termsAccepted || !kvkkAccepted}
                                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-xl hidden lg:flex ${isProcessing || !form.selectedBank || !termsAccepted || !kvkkAccepted
                                            ? "bg-gray-400 cursor-not-allowed opacity-75"
                                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>İşlem Yapılıyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                <span>Banka Transferi ile Devam Et</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                        {/* Kapıda Ödeme İçin Bilgi ve Onay */}
                        {selectedMethod === "cashOnDelivery" && (
                            <div className="border-t pt-6 text-center">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                                    <Banknote className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Kapıda Ödeme Bilgilendirmesi
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Sipariş tutarınızı ürün teslimatı sırasında{" "}
                                        <strong>nakit veya kredi kartı</strong> ile kurye
                                        görevlisine ödeyebilirsiniz. Lütfen teslimat sırasında
                                        ödemeyi yapmayı unutmayın.
                                    </p>
                                </div>

                                {renderContractCheckboxes()}

                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={isProcessing || !termsAccepted || !kvkkAccepted}
                                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-xl hidden lg:flex ${isProcessing || !termsAccepted || !kvkkAccepted
                                        ? "bg-gray-400 cursor-not-allowed opacity-75"
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98]"
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>İşlem Yapılıyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5" />
                                            <span>Siparişi Onayla</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Mobile Sticky Footer */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden">
                            <button
                                onClick={() => handleSubmit()}
                                disabled={isProcessing || (selectedMethod === 'bankTransfer' && !form.selectedBank) || !selectedMethod || !termsAccepted || !kvkkAccepted}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                                    isProcessing || (selectedMethod === 'bankTransfer' && !form.selectedBank) || !selectedMethod || !termsAccepted || !kvkkAccepted
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-75"
                                    : selectedMethod === "creditCard"
                                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                        : selectedMethod === "bankTransfer"
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                            : "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>İşlem Yapılıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        <span>
                                            {!selectedMethod 
                                                ? "Ödeme Yöntemi Seçin"
                                                : selectedMethod === "creditCard" 
                                                    ? "Güvenli Ödeme Yap" 
                                                    : selectedMethod === "bankTransfer" 
                                                        ? "Banka Transferi ile Devam Et" 
                                                        : "Siparişi Onayla"}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Sözleşme Modalları */}
            <ModalComponent
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title="Ön Bilgilendirme Formu ve Satış Sözleşmesi"
                size="lg"
            >
                <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans p-2">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            ÖN BİLGİLENDİRME FORMU
                        </h3>
                        <div className="whitespace-pre-wrap pl-1">
                            {displayPreliminaryForm}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                            MESAFELİ SATIŞ SÖZLEŞMESİ
                        </h3>
                        <div className="whitespace-pre-wrap pl-1">
                            {displayDistanceSalesAgreement}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-6 mt-4">
                        <button
                            onClick={() => {
                                setTermsAccepted(true);
                                setShowTermsModal(false);
                            }}
                            className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition shadow-sm hover:shadow"
                        >
                            Okudum, Onaylıyorum
                        </button>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                isOpen={showKvkkModal}
                onClose={() => setShowKvkkModal(false)}
                title="KVKK Aydınlatma Metni"
                size="lg"
            >
                <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans p-2">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="whitespace-pre-wrap pl-1">{displayKvkkText}</div>
                    </div>

                    <div className="flex justify-end pt-4 sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-6 mt-4">
                        <button
                            onClick={() => {
                                setKvkkAccepted(true);
                                setShowKvkkModal(false);
                            }}
                            className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition shadow-sm hover:shadow"
                        >
                            Okudum
                        </button>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default CreditCartClient;
