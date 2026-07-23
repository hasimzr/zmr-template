"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Star,
    ShoppingCart,
    ArrowLeft,
    Truck,
    Shield,
    X,
    Heart,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { Product, SmallProduct } from "@/types";
import { getProductMainImage, hasDiscount } from "@/utils/product";
import {
    addToFavoritesApi,
    getFavoriteStatusApi,
} from "@/Api/controllers/ProductController";
import { getProductReviewsApi } from "@/Api/controllers/ProductReviewController";
import { useFavorites } from "@/context/FavoritesContext";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { toast } from "react-hot-toast";

interface ProductDetailClientProps {
    initialProduct: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ initialProduct }) => {
    const navigate = useRouter();
    const { addToCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [product] = useState<Product>(initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedImage, setSelectedImage] = useState<string>(getProductMainImage(initialProduct));
    const [isZoomed, setIsZoomed] = useState(false);
    const [bgPosition, setBgPosition] = useState<string>("center");
    const mainImageRef = useRef<HTMLDivElement>(null);

    const [isCommentsMounted, setIsCommentsMounted] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isAddingFavorite, setIsAddingFavorite] = useState(false);
    const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);
    const [loginWarningMounted, setLoginWarningMounted] = useState(false);
    const [errorMessageMounted, setErrorMessageMounted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [reviews, setReviews] = useState<any[]>([]);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [totalReviews, setTotalReviews] = useState(0);

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!product?.id) return;
        if (!isAuthenticated) {
            setIsFavorited(false);
            return;
        }

        const fetchFavoriteStatus = async () => {
            setIsCheckingFavorite(true);
            try {
                const response = await getFavoriteStatusApi(product.id);
                if (response.status === 200) {
                    const favorited = Boolean((response.data as any)?.favorited ?? response.data ?? false);
                    setIsFavorited(favorited);
                }
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            } finally {
                setIsCheckingFavorite(false);
            }
        };

        fetchFavoriteStatus();
    }, [product?.id, isAuthenticated]);

    useEffect(() => {
        if (product?.description && descriptionRef.current) {
            if (descriptionRef.current.scrollHeight > 200) {
                setShowReadMore(true);
            } else {
                setShowReadMore(false);
            }
        }
    }, [product?.description]);

    useEffect(() => {
        if (!isCommentsMounted) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeComments();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isCommentsMounted]);

    const findOptionBySelection = (feat: any, selected: any) => {
        if (!selected || !Array.isArray(feat?.options)) return null;
        return feat.options.find(
            (o: any) =>
                String(o.optionKey ?? o.id) === String(selected) ||
                String(o.id) === String(selected)
        );
    };

    const isInfinityStock = (p: Product) => p?.stockType === "infinity";
    const isProductInStock = (p: Product) => isInfinityStock(p) || (p.stock && p.stock > 0);

    const additionalPrice = useMemo(() => {
        if (!product || !product.features || !Array.isArray(product.features)) return 0;
        let sum = 0;
        for (const feat of product.features) {
            const selId = selectedOptions[String(feat.id || feat.title)];
            if (!selId) continue;
            const opt = findOptionBySelection(feat, selId);
            if (opt && opt.price) sum += Number(opt.price) || 0;
        }
        return sum;
    }, [product, selectedOptions]);

    const basePrice = Number(product?.price) || 0;
    const totalPrice = basePrice + additionalPrice;
    const isDiscounted = hasDiscount(product);
    const discountedTotalPrice = isDiscounted ? totalPrice * product!.discountMultiplier! : totalPrice;

    const allFeaturesSelected = useMemo(() => {
        if (!product || !product.features || !Array.isArray(product.features)) return true;
        return product.features.every((f: any) => {
            const key = String(f.id || f.title);
            return Boolean(selectedOptions[key]);
        });
    }, [product, selectedOptions]);

    const fetchReviews = async (page: number) => {
        if (!product?.id) return;
        setIsReviewsLoading(true);
        try {
            const response = await getProductReviewsApi(product.id, page, 10);
            if (response.status === 200) {
                const data = response.data;
                const newReviews = data.content || [];
                if (page === 1) setReviews(newReviews);
                else setReviews((prev) => [...prev, ...newReviews]);
                setTotalReviews(data.totalElements || 0);
                setHasMoreReviews(!data.last);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsReviewsLoading(false);
        }
    };

    const loadMoreReviews = () => {
        if (!isReviewsLoading && hasMoreReviews) {
            const nextPage = reviewsPage + 1;
            setReviewsPage(nextPage);
            fetchReviews(nextPage);
        }
    };

    const openComments = () => {
        setIsCommentsMounted(true);
        requestAnimationFrame(() => setIsCommentsOpen(true));
        if (reviews.length === 0) {
            setReviewsPage(1);
            fetchReviews(1);
        }
    };

    const closeComments = () => {
        setIsCommentsOpen(false);
        setTimeout(() => setIsCommentsMounted(false), 200);
    };

    const { refreshFavoriteCount } = useFavorites();

    const handleAddToFavorites = async () => {
        if (!isAuthenticated) {
            setLoginWarningMounted(true);
            return;
        }
        if (!user || !product) return;
        setIsAddingFavorite(true);
        try {
            await addToFavoritesApi(product.id);
            setIsFavorited((prev) => !prev);
            await refreshFavoriteCount();
        } catch (error) {
            console.error("Error adding to favorites:", error);
            showErrorMessage("Favorilere eklenirken bir hata oluştu.");
        } finally {
            setIsAddingFavorite(false);
        }
    };

    const closeLoginWarning = () => setLoginWarningMounted(false);
    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setErrorMessageMounted(true);
    };
    const closeErrorMessage = () => setErrorMessageMounted(false);

    const handleAddToCart = () => {
        const selectedFeatures: any[] = [];
        if (Array.isArray(product.features)) {
            for (const feat of product.features) {
                const key = String(feat.id ?? feat.title);
                const selId = selectedOptions[key];
                if (!selId) continue;
                const opt = findOptionBySelection(feat, selId);
                if (opt) {
                    selectedFeatures.push({
                        featureTitle: feat.title ?? feat.name ?? key,
                        optionName: opt.name ?? opt.title ?? String(opt.optionKey ?? opt.id),
                        optionPrice: Number(opt.price) || 0,
                    });
                }
            }
        }

        const payload = {
            id: product.id,
            productUrl: product.productUrl,
            title: product.title,
            price: parseFloat(product.price as any),
            img: product.images[0].imgName,
            currencyType: product.currencyType,
            selectedOptions,
        };

        for (let i = 0; i < quantity; i++) {
            addToCart(payload as any);
        }
        
        toast.success(`${product.title} sepete eklendi!`);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate.back()}
                        className="flex items-center space-x-2 text-gray-600 hover:text-cyan-600 mb-6 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Geri Dön</span>
                    </button>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            <div>
                                <div
                                    ref={mainImageRef}
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => {
                                        setIsZoomed(false);
                                        setBgPosition("center");
                                    }}
                                    onMouseMove={(e) => {
                                        const rect = mainImageRef.current?.getBoundingClientRect();
                                        if (!rect) return;
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        setBgPosition(`${x}% ${y}%`);
                                    }}
                                    className="aspect-square flex justify-center items-center overflow-hidden rounded-lg bg-white cursor-zoom-in"
                                    style={{
                                        backgroundImage: selectedImage ? `url(${selectedImage})` : "none",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: isZoomed ? bgPosition : "center",
                                        backgroundSize: isZoomed ? "200%" : "contain",
                                        transition: "background-size 150ms ease-out, background-position 50ms ease-out",
                                    }}
                                >
                                    {selectedImage && (
                                        <img
                                            src={selectedImage}
                                            alt={product.title}
                                            className={`h-full object-contain select-none transition-opacity duration-150 ${isZoomed ? "opacity-0" : "opacity-100"}`}
                                            aria-hidden={isZoomed}
                                            draggable={false}
                                        />
                                    )}
                                </div>
                                {product.images?.length > 1 && (
                                    <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setSelectedImage(img.imgName)}
                                                className={`group p-1 relative aspect-square rounded-lg overflow-hidden border transition ${selectedImage === img.imgName ? "border-cyan-600 ring-2 ring-cyan-200" : "border-gray-200 hover:border-gray-400"}`}
                                            >
                                                <img src={img.imgName || undefined} alt={`${product.title} ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm text-cyan-600 font-semibold mb-2">{product.subcategory || "Ürün"}</p>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                                <div className="flex items-center space-x-2 mb-6">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.point || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <button onClick={openComments} className="text-gray-600 hover:text-cyan-600 underline-offset-2 hover:underline">
                                        {product.point || 0} ({product.reviewCount || 0} değerlendirme)
                                    </button>
                                </div>

                                <div className="mb-6">
                                    {isDiscounted ? (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                                    %{Math.round((1 - product!.discountMultiplier!) * 100)} İndirim
                                                </span>
                                            </div>
                                            <del className="text-xl text-gray-400">₺{totalPrice.toLocaleString("tr-TR")}</del>
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <p className="text-4xl font-bold text-red-600">₺{discountedTotalPrice.toLocaleString("tr-TR")}</p>
                                                <span className="text-xs sm:text-sm text-gray-500 font-medium">(KDV dahil toplam fiyattır)</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <p className="text-4xl font-bold text-gray-900">₺{totalPrice.toLocaleString("tr-TR")}</p>
                                            <span className="text-xs sm:text-sm text-gray-500 font-medium">(KDV dahil toplam fiyattır)</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    {isProductInStock(product) ? (
                                        <p className="text-green-600 font-semibold">✓ {isInfinityStock(product) ? "Süresiz stok" : `Stokta ${product.stock} adet mevcut`}</p>
                                    ) : (
                                        <p className="text-red-600 font-semibold">✗ Stokta yok</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Miktar</label>
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300">-</button>
                                        <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                        <button onClick={() => setQuantity((q) => isInfinityStock(product) ? q + 1 : Math.max(1, Math.min(product.stock, q + 1)))} className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300">+</button>
                                    </div>
                                </div>

                                {product.features && Array.isArray(product.features) && (
                                    <div className="mb-6">
                                        {product.features.map((feat: any) => {
                                            const fkey = String(feat.id || feat.title);
                                            const selected = selectedOptions[fkey];
                                            return (
                                                <div key={fkey} className="mb-4">
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{feat.title || feat.name}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {feat.options?.map((opt: any) => {
                                                            const optValue = String(opt.optionKey ?? opt.id);
                                                            const available = product.stockType === "unlimited" || opt.stock > 0;
                                                            const isSelected = String(selected) === optValue;
                                                            return (
                                                                <button
                                                                    key={optValue}
                                                                    onClick={() => available && setSelectedOptions(p => ({ ...p, [fkey]: optValue }))}
                                                                    className={`px-3 py-2 rounded-lg border text-left min-w-[100px] transition ${isSelected ? "ring-2 ring-cyan-200 border-cyan-600 bg-cyan-50" : available ? "border-gray-200 hover:border-gray-400" : "border-red-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"}`}
                                                                >
                                                                    {opt.name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="flex gap-3 mb-6">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!isProductInStock(product) || !allFeaturesSelected}
                                        className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Sepete Ekle</span>
                                    </button>
                                    <button
                                        onClick={handleAddToFavorites}
                                        disabled={isAddingFavorite || isCheckingFavorite}
                                        className={`px-4 py-4 rounded-lg border-2 font-semibold transition flex items-center justify-center ${isFavorited ? "bg-cyan-50 border-cyan-600 text-cyan-600" : "border-gray-200 text-gray-600"}`}
                                    >
                                        <Heart className={`w-6 h-6 ${isFavorited ? "fill-cyan-600 text-cyan-600" : ""}`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8 mb-6">
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <Truck className="w-6 h-6 text-cyan-600" />
                                        <div><p className="font-semibold text-sm">Hızlı Teslimat</p><p className="text-xs text-gray-600">2-3 iş günü</p></div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <div><p className="font-semibold text-sm">Güvenli Ödeme</p><p className="text-xs text-gray-600">256-bit SSL</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="m-6">
                            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-8">
                                {product.faqs && product.faqs.length > 0 && (
                                    <div className="mb-8 border-b pb-8">
                                        <h3 className="text-xl font-semibold tracking-[0.08em] uppercase text-cyan-600 mb-5">Sıkça Sorulan Sorular</h3>
                                        <div className="space-y-4">
                                            {product.faqs.map((faq, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                                    <button onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} className="w-full flex items-center justify-between p-4 bg-gray-50 text-left">
                                                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                                                        {openFaqIndex === index ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                                    </button>
                                                    {openFaqIndex === index && <div className="p-4 bg-white text-gray-700 border-t">{faq.answer}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-4 mb-5">
                                    <h3 className="text-xl font-semibold tracking-[0.08em] uppercase text-cyan-600">Ürünü yakından tanıyın</h3>
                                </div>

                                {product.description?.trim() ? (
                                    <div className="relative">
                                        <div
                                            ref={descriptionRef}
                                            className={`rich-text text-gray-800 overflow-hidden transition-all duration-500 ${!isDescriptionExpanded && showReadMore ? "max-h-[200px]" : "max-h-none"}`}
                                            dangerouslySetInnerHTML={{ __html: product.description }}
                                        />
                                        {!isDescriptionExpanded && showReadMore && <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />}
                                        {showReadMore && (
                                            <div className="mt-4 text-center relative z-10">
                                                <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="px-6 py-2 bg-cyan-50 text-cyan-600 rounded-full font-medium">
                                                    {isDescriptionExpanded ? "Daha Az Göster" : "Devamını Oku"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : <p className="text-gray-600">Açıklama bulunmuyor.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Modal */}
            {isCommentsMounted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className={`absolute inset-0 bg-black/40 transition-opacity ${isCommentsOpen ? "opacity-100" : "opacity-0"}`} onClick={closeComments} />
                    <div className={`relative z-10 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl bg-white shadow-xl transition-all ${isCommentsOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <h2 className="text-lg font-semibold">Yorumlar {totalReviews > 0 && `(${totalReviews})`}</h2>
                            <button onClick={closeComments}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50/30 space-y-6">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            {review.userAvatar ? (
                                                <img src={review.userAvatar} alt={review.userName || "Kullanıcı"} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-700">
                                                    {review.userName?.[0]?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-semibold">{review.userName || "Kullanıcı"}</span>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.point ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{review.message}</p>
                                    
                                    {review.imgList && review.imgList.length > 0 && (
                                        <PhotoProvider>
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                {review.imgList.map((img: string, i: number) => (
                                                    <PhotoView key={i} src={img}>
                                                        <img src={img} alt={`Değerlendirme görseli ${i + 1}`} className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-200 hover:opacity-80 transition" />
                                                    </PhotoView>
                                                ))}
                                            </div>
                                        </PhotoProvider>
                                    )}

                                    {review.answer && (
                                        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-1">
                                            <span className="font-semibold text-sm text-cyan-700">Satıcı Yanıtı</span>
                                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{review.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {hasMoreReviews && <button onClick={loadMoreReviews} className="w-full py-3 text-cyan-600 font-semibold">Daha Fazla Yorum</button>}
                        </div>
                        <div className="p-4 border-t flex justify-end"><button onClick={closeComments} className="px-4 py-2 bg-cyan-600 text-white rounded-md">Kapat</button></div>
                    </div>
                </div>
            )}

            {/* Login Warning Modal */}
            {loginWarningMounted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={closeLoginWarning} />
                    <div className="relative z-10 w-full max-w-sm bg-white rounded-xl p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4 text-center">Favorilere Eklemek İçin Giriş Yapın</h2>
                        <div className="flex gap-3">
                            <button onClick={() => navigate.push("/login")} className="flex-1 bg-cyan-600 text-white py-2 rounded-lg font-semibold">Giriş Yap</button>
                            <button onClick={() => navigate.push("/register")} className="flex-1 border-2 border-cyan-600 text-cyan-600 py-2 rounded-lg font-semibold">Kayıt Ol</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetailClient;
