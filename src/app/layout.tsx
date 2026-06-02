import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import ClientProviders from "@/components/layout/ClientProviders";
import ApiProvider from "@/Api/ApiProvider";
import { Toaster } from "react-hot-toast";
import { LogoAndNameData } from "@/types";
import "../index.css";
import "../App.css";
import { getLogoAndNameApiServer, getFooterApiServer, getColorTemplateApiServer, getContractsApiServer, getWhatsappIconApiServer, getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";
import ThemeColorProvider from "@/components/layout/ThemeColorProvider";
import GeneralMetadataPreviewClient from "@/components/common/GeneralMetadataPreviewClient";
import { headers } from "next/headers";

async function getLogoAndNameData(): Promise<LogoAndNameData> {
    try {
        const res = await getLogoAndNameApiServer();
        if (res.data && (res.data.Logo || res.data.SiteNamePrimaryTitle || res.data.Favicon)) {
            return res.data;
        }
    } catch (error) {
        // console.error("Failed to fetch logo and name data:", error);
    }
    return {
        Logo: "",
        SiteNamePrimaryTitle: "Zmrelektronik",
        Favicon: "/favicon.jpg"
    };
}

async function getFooterData(): Promise<any> {
    try {
        const res = await getFooterApiServer();
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        // console.error("Failed to fetch footer data:", error);
    }
    return null;
}

async function getContractsData(): Promise<any> {
    try {
        const res = await getContractsApiServer();
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        // console.error("Failed to fetch contracts data:", error);
    }
    return null;
}

async function getColorTemplateData(): Promise<any> {
    try {
        const res = await getColorTemplateApiServer();
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        // console.error("Failed to fetch color template data:", error);
    }
    return null;
}

async function getWhatsappIconData(): Promise<any> {
    try {
        const res = await getWhatsappIconApiServer();
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        // console.error("Failed to fetch whatsapp icon data:", error);
    }
    return null;
}

async function getGeneralMetadataData(): Promise<any> {
    try {
        const res = await getGeneralTitleAndMateTagApiServer();
        if (res.data) {
            return res.data;
        }
    } catch (error) {
        // console.error("Failed to fetch general metadata:", error);
    }
    return null;
}

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
    const data = await getGeneralMetadataData();
    const generalSeoTitle = data?.generalSeoTitle && data.generalSeoTitle !== "örnek_metin" && data.generalSeoTitle.trim() !== ""
        ? data.generalSeoTitle
        : "Zmrelektronik";

    const generalSeoMetaDescription = data?.generalSeoMetaDescription && data.generalSeoMetaDescription !== "örnek_metin" && data.generalSeoMetaDescription.trim() !== ""
        ? data.generalSeoMetaDescription
        : "Zmrelektronik - Arduino, Raspberry Pi, sensörler ve 10.000+ elektronik bileşen çeşidi için güvenilir alışveriş adresi. Projeniz için teknik destek ve hızlı kargo.";

    const generalSeoMetaKeyWord = data?.generalSeoMetaKeyWord && data.generalSeoMetaKeyWord !== "örnek_metin" && data.generalSeoMetaKeyWord.trim() !== ""
        ? data.generalSeoMetaKeyWord
        : "elektronik bileşen, arduino, raspberry pi, sensörler, geliştirme kartları, robotik, mühendislik";

    const headersList = await headers();
    const host = headersList.get('host') || 'zmrelektronik.com';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    return {
        title: {
            default: `${generalSeoTitle} - Elektronik Bileşen & Geliştirme Kartları`,
            template: `%s | ${generalSeoTitle}`
        },
        description: generalSeoMetaDescription,
        keywords: generalSeoMetaKeyWord.split(",").map((k: string) => k.trim()).filter(Boolean),
        alternates: {
            canonical: baseUrl,
        },
        openGraph: {
            title: `${generalSeoTitle} - Elektronik Bileşen & Geliştirme Kartları`,
            description: generalSeoMetaDescription,
            url: baseUrl,
            siteName: generalSeoTitle,
            locale: 'tr_TR',
            type: 'website',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: 'google-site-verification-id',
        },
        icons: {
            apple: '/apple-touch-icon.png',
        },
    };
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const logoAndNameData = await getLogoAndNameData();
    const footerData = await getFooterData();
    const colorTemplateData = await getColorTemplateData();
    const contractsData = await getContractsData();
    const whatsappIconData = await getWhatsappIconData();
    const generalSeoData = await getGeneralMetadataData();

    const headersList = await headers();
    const host = headersList.get('host') || 'zmrelektronik.com';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    const siteName = logoAndNameData.SiteNamePrimaryTitle || "Zmrelektronik";
    const logoUrl = logoAndNameData.Logo || `${baseUrl}/logo.png`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: siteName,
        image: logoUrl,
        '@id': baseUrl,
        url: baseUrl,
        telephone: '+908500000000',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Merkez Mah. No:1',
            addressLocality: 'Istanbul',
            postalCode: '34000',
            addressCountry: 'TR',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 41.0082,
            longitude: 28.9784,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            opens: '09:00',
            closes: '18:00',
        }
    };

    return (
        <html lang="tr" suppressHydrationWarning>
            <head>
                <link rel="icon" id="Favicon" data-id="Favicon" href={logoAndNameData.Favicon || "/favicon.jpg"} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={inter.className} suppressHydrationWarning>
                <div id="root">
                    <ApiProvider>
                        <ClientProviders>
                            <ThemeColorProvider initialData={colorTemplateData} />
                            <Toaster position="top-right" reverseOrder={false} />
                            <GeneralMetadataPreviewClient initialData={generalSeoData} />
                            <Navbar logoAndNameData={logoAndNameData} />
                            {children}
                            <WhatsAppButton initialData={whatsappIconData} />
                            <Footer logoAndNameData={logoAndNameData} initialData={footerData} initialContractsData={contractsData} />
                        </ClientProviders>
                    </ApiProvider>
                </div>
            </body>
        </html>
    );
}
