"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

interface FAQContentProps {
    faqData: FAQItem[];
}

const FAQContent = ({ faqData }: FAQContentProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

    const categories = [
        "Tümü",
        ...Array.from(new Set(faqData.map((item) => item.category))),
    ];

    const filteredFAQ =
        selectedCategory === "Tümü"
            ? faqData
            : faqData.filter((item) => item.category === selectedCategory);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Kategori Filtreleri */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${selectedCategory === category
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* FAQ Listesi */}
            <div className="space-y-4">
                {filteredFAQ.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                        >
                            <div>
                                <span className="text-xs text-blue-600 font-semibold">
                                    {item.category}
                                </span>
                                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                    {item.question}
                                </h3>
                            </div>
                            {openIndex === index ? (
                                <ChevronUp className="w-6 h-6 text-gray-600 shrink-0" />
                            ) : (
                                <ChevronDown className="w-6 h-6 text-gray-600 shrink-0" />
                            )}
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Yardım İhtiyacı */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Aradığınız cevabı bulamadınız mı?
                </h2>
                <p className="text-gray-600 mb-6">
                    Müşteri hizmetleri ekibimiz size yardımcı olmak için hazır
                </p>
                <a
                    href="/contact"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Bize Ulaşın
                </a>
            </div>
        </div>
    );
};

export default FAQContent;
