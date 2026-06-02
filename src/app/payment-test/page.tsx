import React from 'react';
import PaymentTestClient from './PaymentTestClient';
import { Metadata } from 'next';
import { getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";
import { getPageTitle } from "@/utils/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let brandName = "Zmrelektronik";
  try {
    const generalRes = await getGeneralTitleAndMateTagApiServer();
    if (generalRes?.data?.generalSeoTitle && generalRes.data.generalSeoTitle !== "örnek_metin" && generalRes.data.generalSeoTitle.trim() !== "") {
      brandName = generalRes.data.generalSeoTitle;
    }
  } catch (e) {
    // ignore
  }

  const title = getPageTitle("Ödeme Testi | ZmrElektronik", "Ödeme Testi | ZmrElektronik", brandName);

  return {
    title: { absolute: title },
    description: 'Sipariş ID ile ödeme akışını test edin.',
  };
}

/**
 * PaymentTest Page (Server Component)
 * This is now a Server Component by default, which renders the PaymentTestClient.
 */
const PaymentTest: React.FC = () => {
    return <PaymentTestClient />;
};

export default PaymentTest;
