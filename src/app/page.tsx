import React, { cache } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Slider from "@/components/common/Slider";
import CategorySlider from "@/components/common/CategorySlider";
import TrustBadgesSection from "@/components/common/TrustBadgesSection";
import WhyUsSection from "@/components/common/WhyUsSection";
import HomeFeaturedProducts from "@/components/home/HomeFeaturedProducts";
import { AllProductApiServer } from "@/Api/controllers/ProductController";
import { getAllCategoriesWithImgApiServer, getAllCategoriesApiServer } from "@/Api/controllers/CategoryController";
import { 
  getSliderApiServer, 
  getSiteIconsApiServer, 
  getWhyUsApiServer, 
  getSignUpBannerApiServer,
  getHamePageTitleAndMateTagApiServer,
  getGeneralTitleAndMateTagApiServer
} from "@/Api/controllers/ThemeController";
import SignUpBanner from "@/components/common/SignUpBanner";
import MetadataPreviewClient from "@/components/common/MetadataPreviewClient";
import { Metadata } from "next";
import { getPageTitle } from "@/utils/seo";

export const dynamic = "force-dynamic";

// Deduplicate server-side fetch calls for metadata
const getMetadataData = cache(async () => {
  try {
    const res = await getHamePageTitleAndMateTagApiServer();
    return res?.data || null;
  } catch (error) {
    console.error("Home server-side metadata fetch error:", error);
    return null;
  }
});

const getGeneralMetadata = cache(async () => {
  try {
    const res = await getGeneralTitleAndMateTagApiServer();
    return res?.data || null;
  } catch (error) {
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const [data, generalData] = await Promise.all([
    getMetadataData(),
    getGeneralMetadata()
  ]);

  const brandName = generalData?.generalSeoTitle && generalData.generalSeoTitle !== "örnek_metin" && generalData.generalSeoTitle.trim() !== ""
    ? generalData.generalSeoTitle
    : "Zmrelektronik";
  
  const rawTitle = data?.hamePageTitle && data.hamePageTitle !== "örnek_metin" && data.hamePageTitle.trim() !== ""
    ? data.hamePageTitle
    : "Zmrelektronik - Elektronik Bileşen & Geliştirme Kartları";

  const title = getPageTitle(rawTitle, "Zmrelektronik - Elektronik Bileşen & Geliştirme Kartları", brandName);

  const description = data?.hamePageMetaDescription && data.hamePageMetaDescription !== "örnek_metin" && data.hamePageMetaDescription.trim() !== ""
    ? data.hamePageMetaDescription
    : "Zmrelektronik - Arduino, Raspberry Pi, sensörler ve 10.000+ elektronik bileşen çeşidi için güvenilir alışveriş adresi. Projeniz için teknik destek ve hızlı kargo.";

  const keywords = data?.hamePageMetaKeyWord && data.hamePageMetaKeyWord !== "örnek_metin" && data.hamePageMetaKeyWord.trim() !== ""
    ? data.hamePageMetaKeyWord.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["elektronik bileşen", "arduino", "raspberry pi", "sensörler", "geliştirme kartları", "robotik", "mühendislik"];

  return {
    title: { absolute: title },
    description,
    keywords,
    openGraph: {
      title,
      description,
    }
  };
}


export default async function Home() {
  let bestSellers = [];
  let categories = [];
  let categoriesWithImg = [];
  let sliderList = null;
  let siteIconsList = null;
  let whyUsData = null;
  let signUpBannerData = null;
  let metadataData = null;

  try {
    const [
      productsRes, 
      categoriesRes, 
      categoriesWithImgRes, 
      sliderRes, 
      siteIconsRes, 
      whyUsRes, 
      signUpBannerRes,
      metaData
    ] = await Promise.all([
      AllProductApiServer(1, 10),
      getAllCategoriesApiServer(),
      getAllCategoriesWithImgApiServer(),
      getSliderApiServer().catch(err => {
        console.error("Home server-side slider fetch error:", err);
        return null;
      }),
      getSiteIconsApiServer().catch(err => {
        console.error("Home server-side siteIcons fetch error:", err);
        return null;
      }),
      getWhyUsApiServer().catch(err => {
        console.error("Home server-side why-us fetch error:", err);
        return null;
      }),
      getSignUpBannerApiServer().catch(err => {
        console.error("Home server-side signUpBanner fetch error:", err);
        return null;
      }),
      getMetadataData().catch(err => {
        console.error("Home server-side metadata fetch error:", err);
        return null;
      })
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

    sliderList = sliderRes?.data?.SliderList ?? null;
    siteIconsList = siteIconsRes?.data?.SiteIconsList ?? null;
    whyUsData = whyUsRes?.data ?? null;
    signUpBannerData = signUpBannerRes?.data ?? null;
    metadataData = metaData;

  } catch (error) {
    console.error("Home server-side data fetching error:", error);
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Real-time Metadata Preview Sync */}
      <MetadataPreviewClient initialData={metadataData} />

      {/* SEO H1 Tag - Visually Hidden */}
      <h1 className="sr-only">Zmrelektronik - Elektronik Bileşen, Arduino ve Geliştirme Kartları Marketiniz</h1>

      {/* Hero Slider - Client Component */}
      <Slider initialSlides={sliderList} />

      {/* Trust Badges - Server Component */}
      <TrustBadgesSection initialBadges={siteIconsList} />

      {/* Categories - Client Component with Initial Data */}
      <CategorySlider initialCategories={categoriesWithImg} />

      {/* Featured Products - Client Component with Initial Data for Interactivity */}
      <HomeFeaturedProducts products={bestSellers} categories={categories} />

      {/* Why Choose Us? - Client Component with Dynamic Data */}
      <WhyUsSection initialData={whyUsData} />

      {/* Newsletter / CTA Section - Client Component with Dynamic Data */}
      <SignUpBanner initialData={signUpBannerData} />
    </div>
  );
}


