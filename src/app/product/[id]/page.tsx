import React from "react";
import { Metadata } from "next";
import { GetProductApiServer } from "@/Api/controllers/ProductController";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

import { getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let brandName = "Zmrelektronik";
  try {
    const generalRes = await getGeneralTitleAndMateTagApiServer();
    if (generalRes?.data?.generalSeoTitle && generalRes.data.generalSeoTitle !== "örnek_metin" && generalRes.data.generalSeoTitle.trim() !== "") {
      brandName = generalRes.data.generalSeoTitle;
    }
  } catch (e) {
    // ignore
  }

  try {
    const response = await GetProductApiServer(id);
    if (response.status === 200) {
      const product = response.data;
      return {
        title: { absolute: `${product.title} - ${brandName}` },
        description: product.description?.substring(0, 160).replace(/<[^>]*>?/gm, '') || `${brandName} Elektronik Bileşen Detayı`,
        openGraph: {
          images: product.images?.[0]?.imgName ? [product.images[0].imgName] : [],
        },
      };
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }

  return {
    title: { absolute: `Ürün Detayı - ${brandName}` },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  let product = null;
  try {
    const response = await GetProductApiServer(id);
    if (response.status === 200) {
      product = response.data;
    }
  } catch (error) {
    console.error("Product fetching error:", error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} />;
}
