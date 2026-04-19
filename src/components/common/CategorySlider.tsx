"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";;
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getAllCategoriesWithImgApi } from "@/Api/controllers/CategoryController";

interface Category {
    id: number;
    categoryName: string;
    categoryImg: string;
    categoryStatus: string;
    subCategories: any[];
}

interface CategorySliderProps {
    initialCategories?: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ initialCategories }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories || []);
    const [loading, setLoading] = useState<boolean>(!initialCategories);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialCategories) return;

        const fetchCategories = async () => {
            try {
                const response = await getAllCategoriesWithImgApi();
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data.filter((c: Category) => c.categoryStatus === 'ACTIVE'));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [initialCategories]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === "left" ? -current.offsetWidth / 2 : current.offsetWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="min-w-[150px] h-[180px] bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-14 md:py-20 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-14">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-600 text-xs font-semibold rounded-full mb-3 border border-cyan-100">
                        <Sparkles className="w-3.5 h-3.5" />
                        KATEGORİLER
                    </span>
                    <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                        Kategorilerimiz
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
                        İhtiyacınız olan tüm elektronik bileşenleri keşfedin
                    </p>
                </div>

                <div className="relative group">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none hidden md:block"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>


                    {/* Slider Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.id}`}
                                className="flex-none w-[160px] md:w-[200px] snap-start group/card"
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center h-full flex flex-col">
                                    {/* Image Container with Gradient Background */}
                                    <div className="aspect-square relative flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 group-hover/card:from-cyan-50 group-hover/card:to-blue-50 transition-colors duration-300">
                                        {category.categoryImg ? (
                                            <img
                                                src={category.categoryImg}
                                                alt={category.categoryName}
                                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/card:scale-110"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <Sparkles className="w-12 h-12 text-gray-300 group-hover/card:text-cyan-400 transition-colors" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-center border-t border-gray-50">
                                        <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover/card:text-cyan-600 transition-colors duration-200 line-clamp-2">
                                            {category.categoryName}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:outline-none hidden md:block"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
