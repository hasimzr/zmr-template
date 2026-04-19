import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Slider from "@/components/common/Slider";
import CategorySlider from "@/components/common/CategorySlider";
import TrustBadgesSection from "@/components/common/TrustBadgesSection";
import HomeFeaturedProducts from "@/components/home/HomeFeaturedProducts";
import { AllProductApiServer } from "@/Api/controllers/ProductController";
import { getAllCategoriesWithImgApiServer, getAllCategoriesApiServer } from "@/Api/controllers/CategoryController";

export const dynamic = "force-dynamic";

export default async function Home() {
  let bestSellers = [];
  let categories = [];
  let categoriesWithImg = [];

  try {
    const [productsRes, categoriesRes, categoriesWithImgRes] = await Promise.all([
      AllProductApiServer(1, 10),
      getAllCategoriesApiServer(),
      getAllCategoriesWithImgApiServer()
    ]);

    const productsData = productsRes.data;
    bestSellers = productsData?.products ?? productsData?.data ?? (Array.isArray(productsData) ? productsData : []);
    
    const categoriesData = categoriesRes.data;
    categories = categoriesData?.categories ?? (Array.isArray(categoriesData) ? categoriesData : []);
    
    // Filter active categories for the slider
    const categoriesWithImgData = categoriesWithImgRes.data;
    const rawCategoriesWithImg = categoriesWithImgData?.categories ?? (Array.isArray(categoriesWithImgData) ? categoriesWithImgData : []);
    
    categoriesWithImg = Array.isArray(rawCategoriesWithImg) 
      ? rawCategoriesWithImg.filter((c: any) => c.categoryStatus === 'ACTIVE')
      : [];

  } catch (error) {
    console.error("Home server-side data fetching error:", error);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO H1 Tag - Visually Hidden */}
      <h1 className="sr-only">Zmrelektronik - Elektronik Bileşen, Arduino ve Geliştirme Kartları Marketiniz</h1>

      {/* Hero Slider - Client Component */}
      <Slider />

      {/* Trust Badges - Server Component */}
      <TrustBadgesSection />

      {/* Categories - Client Component with Initial Data */}
      <CategorySlider initialCategories={categoriesWithImg} />

      {/* Featured Products - Client Component with Initial Data for Interactivity */}
      <HomeFeaturedProducts products={bestSellers} categories={categories} />

      {/* Why Choose Us? - Server Component / Static */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 text-violet-600 text-xs font-semibold rounded-full mb-3 border border-violet-100">
              <Star className="w-3.5 h-3.5" />
              NEDEN BİZ?
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Zmrelektronik Farkı
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Orijinal Ürünler",
                description: "Tüm ürünlerimiz orijinal ve garantilidir. Resmi distribütörlerden tedarik ediyoruz.",
                icon: "🔒",
                gradient: "from-blue-50 to-cyan-50",
                border: "border-blue-100",
              },
              {
                title: "Geniş Ürün Yelpazesi",
                description: "10.000+ elektronik bileşen, geliştirme kartı, sensör ve modül çeşidi ile hizmetinizdeyiz.",
                icon: "📦",
                gradient: "from-emerald-50 to-teal-50",
                border: "border-emerald-100",
              },
              {
                title: "Teknik Destek",
                description: "Uzman mühendislerimiz proje geliştirme sürecinizde size rehberlik eder.",
                icon: "🛠️",
                gradient: "from-violet-50 to-purple-50",
                border: "border-violet-100",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`group relative rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section - Server Component / Static */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0wIDM2YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0tMTItMTJjMS42NTYgMCAzLTEuMzQ0IDMtM3MtMS4zNDQtMy0zLTMtMyAxLjM0NC0zIDMgMS4zNDQgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Üye Değil Misiniz?
          </h2>
          <p className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto">
            Hemen üye olun, büyük avantajlardan yararlanın.
          </p>
          <p className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto">
            Elektronik dünyasına adım atın!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-0.5"
            >
              Hemen Üye Ol
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

