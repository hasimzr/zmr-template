import React, { cache } from "react";
import { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getContactApiServer, getContactPageTitleAndMateTagApiServer, getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";
import ContactMetadataPreviewClient from "@/components/common/ContactMetadataPreviewClient";
import { getPageTitle } from "@/utils/seo";

export const dynamic = "force-dynamic";

const getContactMetadataData = cache(async () => {
  try {
    const res = await getContactPageTitleAndMateTagApiServer();
    return res?.data || null;
  } catch (error) {
    // console.error("Contact server-side metadata fetch error:", error);
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

const getContactData = async () => {
  try {
    const res = await getContactApiServer();
    return res.data || null;
  } catch (error) {
    // console.error("Contact data fetch error:", error);
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const [data, generalData] = await Promise.all([
    getContactMetadataData(),
    getGeneralMetadata()
  ]);

  const brandName = generalData?.generalSeoTitle && generalData.generalSeoTitle !== "örnek_metin" && generalData.generalSeoTitle.trim() !== ""
    ? generalData.generalSeoTitle
    : "ZMR Elektronik";

  const rawTitle = data?.contactPageSeoTitle && data.contactPageSeoTitle !== "örnek_metin" && data.contactPageSeoTitle.trim() !== ""
    ? data.contactPageSeoTitle
    : "İletişim - ZMR Elektronik";

  const dynamicTitle = getPageTitle(rawTitle, "İletişim - ZMR Elektronik", brandName);

  const dynamicDescription = data?.contactPageSeoMetaDescription && data.contactPageSeoMetaDescription !== "örnek_metin" && data.contactPageSeoMetaDescription.trim() !== ""
    ? data.contactPageSeoMetaDescription
    : "ZMR Elektronik ile iletişime geçin. Adres, telefon ve e-posta bilgilerimize ulaşın veya bize mesaj gönderin.";

  const dynamicKeywords = data?.contactPageSeoMetaKeyWord && data.contactPageSeoMetaKeyWord !== "örnek_metin" && data.contactPageSeoMetaKeyWord.trim() !== ""
    ? data.contactPageSeoMetaKeyWord.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["iletişim", "zmr elektronik", "iletişim bilgileri", "adres", "telefon", "e-posta"];

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

const Contact = async () => {
  const [data, seoData] = await Promise.all([
    getContactData(),
    getContactMetadataData().catch(err => {
      // console.error("Contact page metadata fetch error:", err);
      return null;
    })
  ]);

  return (
    <>
      <ContactMetadataPreviewClient initialData={seoData} />
      <ContactClient initialData={data} />
    </>
  );
};

export default Contact;
