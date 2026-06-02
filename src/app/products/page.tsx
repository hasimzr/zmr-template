import React, { cache } from "react";
import { Metadata } from "next";
import { AllProductApiServer, ProductApiServer } from "@/Api/controllers/ProductController";
import { getAllCategoriesApiServer } from "@/Api/controllers/CategoryController";
import ProductsClient from "@/components/product/ProductsClient";
import { getProductsPageTitleAndMateTagApiServer, getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";
import ProductsMetadataPreviewClient from "@/components/common/ProductsMetadataPreviewClient";
import { getPageTitle } from "@/utils/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string; subcategory?: string; page?: string }>;
}

const getProductsMetadataData = cache(async () => {
  try {
    const res = await getProductsPageTitleAndMateTagApiServer();
    return res?.data || null;
  } catch (error) {
    console.error("Products server-side metadata fetch error:", error);
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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = params.category;
  
  const [data, generalData] = await Promise.all([
    getProductsMetadataData(),
    getGeneralMetadata()
  ]);

  const brandName = generalData?.generalSeoTitle && generalData.generalSeoTitle !== "örnek_metin" && generalData.generalSeoTitle.trim() !== ""
    ? generalData.generalSeoTitle
    : "Zmrelektronik";

  const rawTitle = data?.productsPageTitle && data.productsPageTitle !== "örnek_metin" && data.productsPageTitle.trim() !== ""
    ? data.productsPageTitle
    : "Tüm Ürünler - Zmrelektronik";

  const dynamicTitle = getPageTitle(rawTitle, "Tüm Ürünler - Zmrelektronik", brandName);

  const dynamicDescription = data?.productsPageMetaDescription && data.productsPageMetaDescription !== "örnek_metin" && data.productsPageMetaDescription.trim() !== ""
    ? data.productsPageMetaDescription
    : "Zmrelektronik - Elektronik bileşenler, sensörler ve geliştirme kartları.";

  const dynamicKeywords = data?.productsPageMetaKeyWord && data.productsPageMetaKeyWord !== "örnek_metin" && data.productsPageMetaKeyWord.trim() !== ""
    ? data.productsPageMetaKeyWord.split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["elektronik bileşen", "arduino", "raspberry pi", "sensörler", "geliştirme kartları", "robotik", "mühendislik"];

  if (categoryId) {
    try {
      const resp = await getAllCategoriesApiServer();
      const categories = resp.data || [];
      const category = categories.find((c: any) => String(c.id) === String(categoryId));
      if (category) {
        const titleSuffix = dynamicTitle.includes(" - ") 
          ? dynamicTitle.split(" - ").slice(1).join(" - ") 
          : brandName;
        return {
          title: { absolute: `${category.categoryName} - ${titleSuffix}` },
          description: `${category.categoryName} kategorisindeki tüm elektronik bileşenleri keşfedin.`,
          keywords: dynamicKeywords,
          openGraph: {
            title: `${category.categoryName} - ${titleSuffix}`,
            description: `${category.categoryName} kategorisindeki tüm elektronik bileşenleri keşfedin.`,
          }
        };
      }
    } catch (e) {
      console.error("Metadata products error:", e);
    }
  }

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

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryId = params.category;
  const subcategoryId = params.subcategory;
  const page = parseInt(params.page || "1");

  let initialProducts = [];
  let categories = [];
  let hasMore = true;
  let metadataData = null;

  try {
    const [categoriesRes, metaData] = await Promise.all([
      getAllCategoriesApiServer(),
      getProductsMetadataData().catch(err => {
        console.error("Products page metadata fetch error:", err);
        return null;
      })
    ]);
    categories = categoriesRes.data || [];
    metadataData = metaData;

    let productsRes;
    if (categoryId || subcategoryId) {
      const filterData = {
        categoryId: categoryId ? Number(categoryId) : null,
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
      };
      productsRes = await ProductApiServer(filterData, page, 10);
    } else {
      productsRes = await AllProductApiServer(page, 10);
    }

    if (productsRes) {
      const resData = productsRes.data || {};
      initialProducts = resData.data || [];
      const totalPagesResp: number | undefined = resData.totalPages;
      const currentPageResp: number = resData.currentPage ?? page;

      if (typeof totalPagesResp === "number") {
        hasMore = currentPageResp < totalPagesResp;
      } else {
        hasMore = initialProducts.length >= 10;
      }
    }
  } catch (error) {
    console.error("Products server-side data fetching error:", error);
  }

  return (
    <>
      <ProductsMetadataPreviewClient initialData={metadataData} />
      <ProductsClient
        initialProducts={initialProducts}
        categories={categories}
        initialHasMore={hasMore}
      />
    </>
  );
}

