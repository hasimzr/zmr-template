"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import type { Category, SmallProduct } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import {
    AllProductApi,
    ProductApi,
} from "@/Api/controllers/ProductController";

interface ProductsClientProps {
    initialProducts: SmallProduct[];
    categories: Category[];
    initialHasMore: boolean;
    initialTotalPages?: number;
}

const ProductsClient: React.FC<ProductsClientProps> = ({
    initialProducts,
    categories,
    initialHasMore,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryIdParam = searchParams?.get("category");
    const subcategoryIdParam = searchParams?.get("subcategory");

    const [products, setProducts] = useState<SmallProduct[]>(initialProducts);
    const [filteredProducts, setFilteredProducts] = useState<SmallProduct[]>(initialProducts);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        categoryIdParam ? Number(categoryIdParam) : null
    );
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
        subcategoryIdParam ? String(subcategoryIdParam) : null
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [sortBy, setSortBy] = useState<string>("default");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    // Sync state with URL params
    useEffect(() => {
        setSelectedCategory(categoryIdParam ? Number(categoryIdParam) : null);
        setSelectedSubcategory(subcategoryIdParam ? String(subcategoryIdParam) : null);
        setPage(1);
        // When URL params change, we could either re-fetch or use initial data if it's the first load
        // For simplicity in this refactor, we'll re-fetch when params change on the client too
        fetchFilteredProducts(1, true);
    }, [categoryIdParam, subcategoryIdParam]);

    useEffect(() => {
        let result = [...products];

        result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        switch (sortBy) {
            case "price-asc": result.sort((a, b) => a.price - b.price); break;
            case "price-desc": result.sort((a, b) => b.price - a.price); break;
            case "rating": result.sort((a, b) => (b.point || 0) - (a.point || 0)); break;
            case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
        }

        setFilteredProducts(result);
    }, [products, priceRange, sortBy]);

    const fetchFilteredProducts = async (pageArg = 1, reset = false) => {
        if (reset) setLoading(true);
        else setIsFetchingMore(true);

        try {
            let response;
            if (categoryIdParam || subcategoryIdParam) {
                const data = {
                    categoryId: categoryIdParam ? Number(categoryIdParam) : null,
                    subcategoryId: subcategoryIdParam ? Number(subcategoryIdParam) : null,
                };
                response = await ProductApi(data, pageArg, 10);
            } else {
                response = await AllProductApi(pageArg, 10);
            }

            if (response) {
                const resData = response.data || {};
                const incoming: SmallProduct[] = resData.data || [];
                const totalPagesResp: number | undefined = resData.totalPages;
                const currentPageResp: number = resData.currentPage ?? pageArg;

                if (reset) {
                    setProducts(incoming);
                } else {
                    setProducts((prev) => [...prev, ...incoming]);
                }

                if (typeof totalPagesResp === "number") {
                    setHasMore(currentPageResp < totalPagesResp);
                } else {
                    setHasMore(incoming.length >= 10);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setPriceRange([0, 100000]);
        setSortBy("default");
        router.push("/products");
    };

    useEffect(() => {
        const onScroll = () => {
            if (loading || isFetchingMore || !hasMore) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                const next = page + 1;
                setPage(next);
                fetchFilteredProducts(next);
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [page, loading, isFetchingMore, hasMore, categoryIdParam, subcategoryIdParam]);

    const selectedCategoryObj = categories.find((c) => c.id === Number(selectedCategory));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {showFilters && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
                    )}

                    <div className={`lg:col-span-1 ${showFilters ? "fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:w-auto" : "hidden lg:block"}`}>
                        <div className="bg-white h-screen lg:h-auto lg:max-h-[calc(100vh-120px)] overflow-auto rounded-none lg:rounded-xl shadow-2xl lg:shadow-lg p-6 lg:sticky lg:top-24 border-r lg:border-r-0 lg:border border-gray-200">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <h2 className="text-xl font-bold flex items-center text-gray-900">
                                    <Filter className="w-5 h-5 mr-2 text-cyan-600" /> Filtreler
                                </h2>
                                <button onClick={clearFilters} className="text-sm text-cyan-600 flex items-center gap-1"><X className="w-4 h-4" /> Temizle</button>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase">Kategoriler</h3>
                                <div className="space-y-1.5">
                                    <button onClick={() => router.push("/products")} className={`block w-full text-left px-4 py-2 rounded-lg ${!selectedCategory ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>Tümü</button>
                                    {categories.map((cat) => (
                                        <button key={cat.id} onClick={() => router.push(`/products?category=${cat.id}`)} className={`block w-full text-left px-4 py-2 rounded-lg ${selectedCategory === cat.id ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>{cat.categoryName}</button>
                                    ))}
                                </div>
                            </div>

                            {selectedCategoryObj?.subCategories && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase">Alt Kategoriler</h3>
                                    <div className="space-y-1.5">
                                        {selectedCategoryObj.subCategories.map((sub) => (
                                            <button key={sub.id} onClick={() => router.push(`/products?category=${selectedCategory}&subcategory=${sub.id}`)} className={`block w-full text-left px-4 py-2 rounded-lg text-sm ${selectedSubcategory === String(sub.id) ? "bg-cyan-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}>{sub.categoryName}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase">Fiyat Aralığı</h3>
                                <input type="range" min="0" max="100000" step="1000" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg accent-cyan-600" />
                                <div className="flex justify-between mt-2 text-sm"><span>₺0</span><span className="text-cyan-600 font-bold">₺{priceRange[1].toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{selectedCategoryObj ? selectedCategoryObj.categoryName : "Tüm Ürünler"}</h1>
                                <p className="text-gray-600 text-sm">{filteredProducts.length} ürün bulundu</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={() => setShowFilters(true)} className="lg:hidden flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg">Filtrele</button>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500">
                                    <option value="default">Varsayılan</option>
                                    <option value="price-asc">Fiyat: Artan</option>
                                    <option value="price-desc">Fiyat: Azalan</option>
                                    <option value="rating">Puan</option>
                                    <option value="newest">Yeni</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map((p) => <ProductCard key={p.id} product={p} categories={categories} />)}
                            </div>
                        ) : (
                            <div className="bg-white p-12 text-center rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Ürün Bulunamadı</h3>
                                <button onClick={clearFilters} className="text-cyan-600 font-bold">Filtreleri Temizle</button>
                            </div>
                        )}
                        {isFetchingMore && <div className="text-center py-8">Yükleniyor...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsClient;
