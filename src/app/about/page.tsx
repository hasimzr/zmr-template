import React, { cache } from "react";
import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getAboutUsApiServer, getAboutUsTitleAndMateTagApiServer, getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";
import AboutMetadataPreviewClient from "@/components/common/AboutMetadataPreviewClient";
import { getPageTitle } from "@/utils/seo";

export const dynamic = "force-dynamic";

const getAboutMetadataData = cache(async () => {
  try {
    const res = await getAboutUsTitleAndMateTagApiServer();
    return res?.data || null;
  } catch (error) {
    // console.error("About server-side metadata fetch error:", error);
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

const getAboutData = async () => {
  try {
    const res = await getAboutUsApiServer();
    return res.data || null;
  } catch (error) {
    // console.error("About data fetch error:", error);
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const [data, generalData] = await Promise.all([
    getAboutMetadataData(),
    getGeneralMetadata()
  ]);

  const brandName = generalData?.generalSeoTitle && generalData.generalSeoTitle !== "örnek_metin" && generalData.generalSeoTitle.trim() !== ""
    ? generalData.generalSeoTitle
    : "ZMR Elektronik";

  const rawTitle = data?.AboutUsSeoTitle && data.AboutUsSeoTitle !== "örnek_metin" && data.AboutUsSeoTitle.trim() !== ""
    ? data.AboutUsSeoTitle
    : "Hakkımızda - ZMR Elektronik";

  const dynamicTitle = getPageTitle(rawTitle, "Hakkımızda - ZMR Elektronik", brandName);

  const dynamicDescription = data?.AboutUsSeoMetaDescription && data.AboutUsSeoMetaDescription !== "örnek_metin" && data.AboutUsSeoMetaDescription.trim() !== ""
    ? data.AboutUsSeoMetaDescription
    : "ZMR Elektronik - Endüstriyel elektronik ürünler, elektrik motorları ve güç elektroniği ekipmanları alanında uzman mühendislik temelli tedarik platformu.";

  const dynamicKeywords = data?.AboutUsSeoMetaKeyWord && data.AboutUsSeoMetaKeyWord !== "örnek_metin" && data.AboutUsSeoMetaKeyWord.trim() !== ""
    ? data.AboutUsSeoMetaKeyWord.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["endüstriyel elektronik", "elektrik motorları", "güç elektroniği", "mühendislik", "zmr elektronik"];

  return {
    title: { absolute: dynamicTitle },
    description: dynamicDescription,
    keywords: dynamicKeywords,
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
    }
  };
}

const About = async () => {
  const [data, seoData] = await Promise.all([
    getAboutData(),
    getAboutMetadataData().catch(err => {
      // console.error("About page metadata fetch error:", err);
      return null;
    })
  ]);

  return (
    <>
      <AboutMetadataPreviewClient initialData={seoData} />
      <AboutClient initialData={data} />
    </>
  );
};

export default About;
