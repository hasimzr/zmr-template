"use client";
import Link from "next/link";
import { ShoppingBag, Lock, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Basket from "@/components/Basket";
import LoginOrUserDataEntry from "@/components/LoginOrUserDataEntry";
import AddressSelection from "@/components/AddressSelection";
import SummaryOrder from "@/components/SummaryOrder";
import CreditCart, { type PaymentInfo } from "@/components/CreditCart";
import type { Address, PaymentOptions } from "@/types";
import {
    addOrderApi,
    getPaymentOptionsApi,
    initializeIyzicoPaymentApi,
    initializePaytrPaymentApi,
} from "@/Api/controllers/OrderController";

type OrderType = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
};

interface CartClientContentProps {
    orderIdParam?: string | null;
}

const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(`${label} kopyalandı`);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Kopyalanamadı");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-cyan-600"
            title={`${label} Kopyala`}
        >
            {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
};

export default function CartClientContent({ orderIdParam }: CartClientContentProps) {
    const { cartItems, clearCart, cartTotal } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState<number>(1);
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
    const [paymentOptions, setPaymentOptions] = useState<PaymentOptions | null>(null);

    const stepInfo = isAuthenticated
        ? [
            { num: 1, label: "Sepetim" },
            { num: 2, label: "Adres Seçimi" },
            { num: 3, label: "Ödeme Yöntemi" },
            { num: 4, label: "Sonuç" },
        ]
        : [
            { num: 1, label: "Sepetim" },
            { num: 2, label: "Kayıt/Giriş veya Devam Et" },
            { num: 3, label: "Adres Seçimi" },
            { num: 4, label: "Ödeme Yöntemi" },
            { num: 5, label: "Sonuç" },
        ];


    const [orderData, setOrderData] = useState<OrderType>({
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            setOrderData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phoneNumber || null,
            });
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | undefined>(
        undefined,
    );

    useEffect(() => {
        if (orderIdParam) {
            setOrderNumber(orderIdParam);
            setStep(isAuthenticated ? 5 : 6);
        }
    }, [orderIdParam, isAuthenticated]);

    // Ödeme seçeneklerini getir
    useEffect(() => {
        if (cartItems.length > 0) {
            const stringList = cartItems.map((item) => item.product.id);
            getPaymentOptionsApi(stringList)
                .then((res) => setPaymentOptions(res.data))
                .catch((err) => console.error("Ödeme seçenekleri alınamadı:", err));
        }
    }, [cartItems]);

    // Script Yükleme Mantığı (Script Loader Effect)
    useEffect(() => {
        if (paymentHtml) {
            const div = document.createElement("div");
            div.innerHTML = paymentHtml;
            const scripts = Array.from(div.getElementsByTagName("script"));

            const loadScripts = async () => {
                for (const oldScript of scripts) {
                    await new Promise<void>((resolve) => {
                        const newScript = document.createElement("script");
                        newScript.type = "text/javascript";
                        if (oldScript.src) {
                            newScript.src = oldScript.src;
                            newScript.onload = () => resolve();
                            newScript.onerror = () => resolve();
                            document.body.appendChild(newScript);
                        } else {
                            newScript.textContent = oldScript.textContent;
                            document.body.appendChild(newScript);
                            resolve();
                        }
                    });
                }
            };
            loadScripts();
        }
    }, [paymentHtml]);

    const handleCheckout = () => {
        setStep(2);
    };

    const handleSubmitOrder = async () => {
        const toOptionKeyArray = (item: any) => {
            const optionMap = item?.selectedOptions || {};
            if (!item?.product?.features || !Array.isArray(item.product.features)) {
                return Object.values(optionMap);
            }

            return Object.entries(optionMap).map(([featKey, selectedValue]) => {
                const feature = item.product.features.find(
                    (f: any) => String(f.id || f.title) === String(featKey),
                );
                const matchedOption = feature?.options?.find(
                    (o: any) =>
                        String(o.optionKey ?? o.id) === String(selectedValue) ||
                        String(o.id) === String(selectedValue),
                );
                return matchedOption?.optionKey ?? selectedValue;
            });
        };

        const payload: any = {
            email: orderData.email,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            phoneNumber: orderData.phone,
            addressLine: selectedAddress?.addressLine,
            fullName: selectedAddress?.fullName,
            city: selectedAddress?.city,
            companyName: selectedAddress?.companyName,
            district: selectedAddress?.district,
            isDefault: selectedAddress?.isDefault,
            neighborhood: selectedAddress?.neighborhood,
            phone: selectedAddress?.phone,
            postalCode: selectedAddress?.postalCode,
            taxNumber: selectedAddress?.taxNumber,
            taxOffice: selectedAddress?.taxOffice,
            title: selectedAddress?.title,
            type: selectedAddress?.type,
            paymentMethod: paymentInfo?.paymentMethod,
            orderProductList: cartItems.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
                selectedOptions: toOptionKeyArray(item),
            })),
        };

        try {
            const provider = paymentInfo?.provider || paymentOptions?.creditCard?.provider;

            if (paymentInfo?.paymentMethod === "creditCard") {
                if (provider === "paytr") {
                    const res = await initializePaytrPaymentApi(payload);
                    if (res?.data) {
                        const htmlContent = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
                        setPaymentHtml(htmlContent);
                    }
                    return;
                } else if (provider === "iyzico") {
                    const res = await initializeIyzicoPaymentApi(payload);
                    if (res?.data) {
                        let htmlContent = typeof res.data === "string" ? res.data : JSON.stringify(res.data);
                        htmlContent = htmlContent
                            .replace(/(class|className)\s*=\s*\\?["']\s*popup\s*\\?["']/g, 'class="responsive"')
                            .replace(/\\?["']?pageType\\?["']?\s*:\s*\\?["']\s*popup\s*\\?["']/g, '"pageType": "responsive"');
                        setPaymentHtml(htmlContent);
                    }
                    return;
                } else {
                    payload.cardNumber = paymentInfo.cardNumber;
                    payload.cardHolder = paymentInfo.cardHolder;
                    payload.expiryMonth = paymentInfo.expiryMonth;
                    payload.expiryYear = paymentInfo.expiryYear;
                    payload.cvv = paymentInfo.cvv;
                }
            }

            if (
                paymentInfo?.paymentMethod === "bankTransfer" &&
                paymentInfo.selectedBank
            ) {
                payload.selectedBankName = paymentInfo.selectedBank.bankName;
                payload.selectedBankAccount = paymentInfo.selectedBank.accountHolder;
                payload.selectedBankIban = paymentInfo.selectedBank.iban;
            }

            let res = await addOrderApi(payload);
            if (res) {
                if (paymentInfo?.paymentMethod === "creditCard" && typeof res.data === "string" && res.data.includes("<")) {
                    let htmlContent = res.data;
                    if (htmlContent.includes("iyzico") || htmlContent.includes("iyzipay")) {
                        htmlContent = htmlContent
                            .replace(/(class|className)\s*=\s*\\?["']\s*popup\s*\\?["']/g, 'class="responsive"')
                            .replace(/\\?["']?pageType\\?["']?\s*:\s*\\?["']\s*popup\s*\\?["']/g, '"pageType": "responsive"');
                    }
                    setPaymentHtml(htmlContent);
                } else {
                    setStep(isAuthenticated ? 5 : 6);
                    setOrderNumber(res.data);
                }
            }
        } catch (err: any) {
            console.error("Ödeme hatası:", err);
            toast.error(err?.response?.data?.message || err?.message || "Sipariş oluşturulurken bir hata oluştu");
        }
    };

    if (cartItems.length === 0 && !orderNumber) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Sepetiniz Boş
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Alışverişe başlamak için ürünlerimize göz atın
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition"
                        >
                            Alışverişe Başla
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-10 pb-24 sm:pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Alışveriş Sepeti
                    </h1>
                    <p className="text-sm text-gray-600">
                        {stepInfo[step - 1]?.label || "Sepetiniz"}
                    </p>
                </div>

                <div className="mb-6 sm:mb-10">
                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 overflow-x-auto">
                        <div className="flex items-center justify-between min-w-max sm:min-w-0">
                            {stepInfo.map((s, index) => (
                                <div key={s.num} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1 relative">
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 shadow-md relative z-10 ${step === s.num
                                                ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white scale-110 ring-4 ring-cyan-100"
                                                : step > s.num
                                                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:scale-105"
                                                    : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                                                }`}
                                        >
                                            {step > s.num ? (
                                                <svg
                                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                s.num
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs sm:text-sm mt-2 font-medium whitespace-nowrap text-center px-2 transition-colors duration-300 ${step === s.num
                                                ? "text-cyan-700 font-semibold"
                                                : step > s.num
                                                    ? "text-emerald-700"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {index < stepInfo.length - 1 && (
                                        <div className="flex-1 h-1 mx-2 sm:mx-4 rounded-full overflow-hidden bg-gray-200 relative">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${step > s.num
                                                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 w-full"
                                                    : "w-0 bg-cyan-600"
                                                    }`}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {paymentHtml ? (
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 min-h-[500px] mb-8">
                        <div className="mb-6 flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-cyan-100 p-2.5 rounded-xl">
                                    <Lock className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Güvenli Ödeme Ekranı</h3>
                                    <p className="text-sm text-gray-500">Lütfen ödeme bilgilerinizi tamamlayın</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPaymentHtml(null)}
                                className="text-sm font-medium text-gray-500 hover:text-cyan-600 underline"
                            >
                                Ödeme Yöntemini Değiştir / İptal
                            </button>
                        </div>
                        <div className="iyzico-paytr-container min-h-[400px]">
                            {/* İyzico'nun inject olacağı div ID'si */}
                            <div id="iyzipay-checkout-form" className="responsive"></div>
                            {/* HTML ve PayTR iframe içeriği */}
                            <div dangerouslySetInnerHTML={{ __html: paymentHtml }} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {((isAuthenticated && step < 4) || (!isAuthenticated && step < 5)) && (
                        <div className="lg:col-span-2 space-y-4">
                            {step > 1 && step < 5 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors mb-2 font-medium"
                                >
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
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    <span>Geri Dön ({stepInfo[step - 2]?.label})</span>
                                </button>
                            )}

                            {step === 1 && <Basket />}
                            {step === 2 && !isAuthenticated && (
                                <LoginOrUserDataEntry
                                    isGuest={isGuest}
                                    setIsGuest={setIsGuest}
                                    orderData={orderData}
                                    setOrderData={setOrderData}
                                    onComplete={() => setStep(3)}
                                />
                            )}
                            {step === 2 && isAuthenticated && (
                                <AddressSelection
                                    addresses={addresses}
                                    setAddresses={setAddresses}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    orderData={orderData}
                                    onComplete={(address) => {
                                        setSelectedAddress(address);
                                        setStep(3);
                                    }}
                                />
                            )}
                            {step === 3 && !isAuthenticated && (
                                <AddressSelection
                                    addresses={addresses}
                                    setAddresses={setAddresses}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    orderData={orderData}
                                    onComplete={(address) => {
                                        setSelectedAddress(address);
                                        setStep(4);
                                    }}
                                />
                            )}
                            {step === 3 && isAuthenticated && (
                                <CreditCart
                                    orderData={orderData}
                                    paymentInfo={paymentInfo}
                                    onComplete={(payment) => {
                                        setPaymentInfo(payment);
                                        setStep(4);
                                    }}
                                />
                            )}
                            {step === 4 && !isAuthenticated && (
                                <CreditCart
                                    orderData={orderData}
                                    paymentInfo={paymentInfo}
                                    onComplete={(payment) => {
                                        setPaymentInfo(payment);
                                        setStep(5);
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {((step === 4 && isAuthenticated) ||
                        (step === 5 && !isAuthenticated)) && (
                            <SummaryOrder
                                orderData={orderData}
                                address={selectedAddress}
                                payment={paymentInfo}
                                onComplete={() => handleSubmitOrder()}
                                onBack={() => {
                                    setStep(step - 1);
                                }}
                            />
                        )}
                    {((step === 5 && isAuthenticated) ||
                        (step === 6 && !isAuthenticated)) && (
                            <div className="lg:col-span-3">
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-emerald-200">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                                        <svg
                                            className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                        🎉 Siparişiniz Alındı!
                                    </h2>
                                    <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                                        {paymentInfo?.paymentMethod === "bankTransfer"
                                            ? "Siparişiniz başarıyla oluşturuldu. Aşağıdaki banka hesap bilgilerine ödeme yapabilirsiniz."
                                            : "Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir."}
                                    </p>
                                    <div className="bg-white rounded-xl p-6 sm:p-8 mb-8 shadow-md border border-green-100 max-w-md mx-auto">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <ShoppingBag className="w-5 h-5 text-emerald-600" />
                                            <p className="text-sm font-semibold text-gray-600">
                                                Sipariş Numaranız
                                            </p>
                                        </div>
                                        <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
                                            #{orderNumber}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-3">
                                            Bu numarayı kullanarak siparişinizi takip edebilirsiniz
                                        </p>
                                    </div>

                                    {paymentInfo?.paymentMethod === "bankTransfer" &&
                                        paymentInfo?.selectedBank && (
                                            <div className="bg-purple-50 rounded-xl p-6 sm:p-8 mb-8 shadow-md border border-purple-200 max-w-2xl mx-auto">
                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <svg
                                                        className="w-6 h-6 text-purple-600"
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
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        Ödeme Yapılacak Banka Hesabı
                                                    </h3>
                                                </div>
                                                <div className="space-y-3 text-left bg-white rounded-lg p-4 border border-purple-100">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Banka Adı:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {paymentInfo.selectedBank.bankName}
                                                            </span>
                                                            <CopyButton 
                                                                text={paymentInfo.selectedBank.bankName} 
                                                                label="Banka Adı" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Hesap Sahibi:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {paymentInfo.selectedBank.accountHolder}
                                                            </span>
                                                            <CopyButton 
                                                                text={paymentInfo.selectedBank.accountHolder} 
                                                                label="Hesap Sahibi" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            IBAN:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-mono font-medium">
                                                                {paymentInfo.selectedBank.iban}
                                                            </span>
                                                            <CopyButton 
                                                                text={paymentInfo.selectedBank.iban} 
                                                                label="IBAN" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Açıklama:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-medium italic">
                                                                #{orderNumber} nolu sipariş ödemesi
                                                            </span>
                                                            <CopyButton 
                                                                text={`#${orderNumber} nolu sipariş ödemesi`} 
                                                                label="Açıklama" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Tutar:
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-purple-700">
                                                                ₺{(cartTotal * 1.2).toLocaleString("tr-TR")}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                                (KDV Dahil Toplam Fiyat)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-3">
                                                    <div className="flex items-start gap-2">
                                                        <svg
                                                            className="w-5 h-5 text-amber-600 mt-0.5 shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <p className="text-xs text-amber-800">
                                                            <strong>Önemli:</strong> Ödeme açıklamasına{" "}
                                                            <strong className="font-bold">
                                                                #{orderNumber}
                                                            </strong>{" "}
                                                            sipariş numaranızı yazmayı unutmayın. Ödemeniz
                                                            onaylandıktan sonra siparişiniz işleme alınacaktır.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {paymentInfo?.paymentMethod === "cashOnDelivery" && (
                                        <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow-md border border-blue-200 max-w-md mx-auto">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <svg
                                                    className="w-5 h-5 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <p className="text-sm font-semibold text-blue-800">
                                                    Kapıda Ödeme Seçildi
                                                </p>
                                            </div>
                                            <p className="text-xs text-blue-700">
                                                Ödemenizi ürün teslim edildiğinde nakit veya kredi kartı
                                                ile yapabilirsiniz.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                            onClick={() => {
                                                clearCart();
                                                setOrderNumber(null);
                                                setStep(1);
                                            }}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            Alışverişe Devam Et
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-gray-300"
                                            onClick={() => {
                                                clearCart();
                                                setOrderNumber(null);
                                                setStep(1);
                                            }}
                                        >
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
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            Siparişlerimi Gör
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                    {((step < 4 && isAuthenticated) ||
                        (step < 5 && !isAuthenticated)) && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                                        <ShoppingBag className="w-5 h-5 text-cyan-600" />
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Sipariş Özeti
                                        </h2>
                                    </div>

                                    <div className="bg-cyan-50 rounded-lg p-3 mb-4 border border-cyan-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-cyan-900">
                                                Sepetteki Ürün
                                            </span>
                                            <span className="text-sm font-bold text-cyan-700">
                                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                                                Adet
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-700">
                                            <span className="text-sm">Ara Toplam</span>
                                            <span className="font-semibold">
                                                ₺{(cartTotal * 1.2).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span className="text-sm">Kargo</span>
                                            <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Ücretsiz
                                            </span>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-900">
                                                    Toplam
                                                </span>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-cyan-600">
                                                        ₺{(cartTotal * 1.2).toLocaleString("tr-TR")}
                                                    </div>
                                                    <div className="text-xs text-gray-500">KDV Dahil</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {step === 1 && (
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3.5 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all duration-300 mb-3 shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <span>Adres Seçimi</span>
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
                                        </button>
                                    )}

                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                                    >
                                        Sepeti Temizle
                                    </button>

                                    {step > 1 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="w-full mt-2 flex items-center justify-center bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                                        >
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
                                                    d="M11 7l-5 5m0 0l5 5m-5-5H18"
                                                />
                                            </svg>
                                            <span>{stepInfo[step - 2]?.label}'ne dön</span>
                                        </button>
                                    )}

                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex items-center gap-2 justify-center mb-3">
                                            <Lock className="w-4 h-4 text-green-600" />
                                            <p className="text-sm font-semibold text-gray-700">
                                                Güvenli Ödeme
                                            </p>
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-14 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                VISA
                                            </div>
                                            <div className="w-14 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                MC
                                            </div>
                                            <div className="w-14 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                AMEX
                                            </div>
                                        </div>
                                        <p className="text-xs text-center text-gray-500 mt-3">
                                            256-bit SSL şifreleme ile güvende
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex items-center justify-center gap-4 text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-8 h-8 mb-1 text-green-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                                <span className="text-xs font-medium">Güvenli</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-8 h-8 mb-1 text-cyan-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                                    />
                                                </svg>
                                                <span className="text-xs font-medium">Hızlı Kargo</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-8 h-8 mb-1 text-purple-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                                <span className="text-xs font-medium">Kolay İade</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {step === 1 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">Toplam</span>
                        <span className="text-xl font-bold text-cyan-600">
                            ₺{(cartTotal * 1.2).toLocaleString("tr-TR")}
                        </span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3 rounded-lg font-bold shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        <span>Adres Seçimi</span>
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
                    </button>
                </div>
            )}
        </div>
    );
}
