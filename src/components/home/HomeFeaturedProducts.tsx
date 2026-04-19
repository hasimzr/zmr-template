"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import HorizontalProductCard from "@/components/product/HorizontalProductCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { addToFavoritesApi } from "@/Api/controllers/ProductController";
import type { Product, Category, BasketData, SmallProduct } from "@/types";
import { getProductMainImage } from "@/utils/product";
import { toast } from "react-hot-toast";

interface HomeFeaturedProductsProps {
    products: Product[];
    categories: Category[];
}

const normalizePrice = (price: number | string | undefined): number => {
    if (typeof price === "number") return price;
    const parsed = Number(price ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
};

const getImage = (item: Product | SmallProduct): string => {
    if ((item as Product).images && (item as Product).images.length > 0) {
        return getProductMainImage(item as Product) || "/placeholder-product.jpg";
    }
    const imgs = (item as SmallProduct).img;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    return "/placeholder-product.jpg";
};

const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
    products,
    categories,
}) => {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = (item: Product | SmallProduct) => {
        const payload: BasketData = {
            id: item.id,
            productUrl: (item as Product).productUrl ?? (item as SmallProduct).productUrl ?? item.id,
            title: item.title,
            price: normalizePrice((item as Product).price),
            img: getImage(item),
            currencyType: (item as Product).currencyType ?? "TRY",
            discountMultiplier: (item as any).discountMultiplier,
        } as BasketData;

        addToCart(payload);
        toast.success(`${item.title} sepete eklendi!`);
    };

    const handleToggleFavorite = async (productId: string) => {
        try {
            await addToFavoritesApi(productId);
            // Opsiyonel: Favori durumunu güncellemek için bir state tutulabilir
            // Ancak şimdilik sadece API çağrısı yapıyoruz.
        } catch (error) {
            console.error("Favori işlemi başarısız:", error);
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="py-14 md:py-20 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full mb-3 border border-amber-100">
                            <TrendingUp className="w-3.5 h-3.5" />
                            ÖNE ÇIKANLAR
                        </span>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                            Ürünlerimizden Bazıları
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold text-sm transition-colors"
                    >
                        Tümünü Gör
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {products.map((product) => (
                        <HorizontalProductCard
                            key={product.id}
                            item={product}
                            categories={categories}
                            onAddToCart={handleAddToCart}
                            onNavigate={(url) => router.push(`/product/${url}`)}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorite={false} // Varsayılan olarak false kabul ediyoruz, gerçek veri API'den gelmeli
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeFeaturedProducts;
