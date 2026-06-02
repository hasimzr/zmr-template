"use client";

import React, { useState, useEffect } from "react";
import { Target, CheckCircle, Settings, ShieldCheck } from "lucide-react";

export interface PlatformFeature {
  [key: string]: string;
}

export interface AboutData {
  aboutusHeaderSectionBgColor: string;
  aboutusHeaderMainTitle: string;
  aboutusHeaderSubTitle: string;
  aboutusIntroBoldText: string;
  aboutusIntroDescriptionText: string;
  aboutusFeaturesSectionTitle: string;
  aboutusPlatformFeaturesList: PlatformFeature[];
  aboutusLeftCardTitle: string;
  aboutusLeftCardContent: string;
  aboutusRightCardTitle: string;
  aboutusRightCardContent: string;
  aboutusFooterSectionBgColor: string;
  aboutusFooterSectionTitle: string;
  aboutusFooterSectionDescription: string;
  aboutusFooterHighlightText: string;
}

export const fallbackAboutData: AboutData = {
  aboutusHeaderSectionBgColor: "bg-gradient-to-r from-cyan-600 to-blue-700",
  aboutusHeaderMainTitle: "Hakkımızda",
  aboutusHeaderSubTitle: "ZMR Elektronik - Endüstriyel Çözüm Ortağınız",
  aboutusIntroBoldText: "ZMR Elektronik",
  aboutusIntroDescriptionText: ", endüstriyel elektronik ürünler, elektrik motorları, güç elektroniği ekipmanları ve makine yedek parçaları alanında faaliyet gösteren mühendislik temelli bir e-ticaret ve teknik tedarik platformudur.\n\nElektronik malzeme satışı, motor ve sürücü sistemleri, endüstriyel komponent tedariki ve makine ekipman yedek parça çözümleri konusunda uzmanlaşan ZMR Elektronik; üretim yapan firmalar, teknik servisler, proje ekipleri ve sanayi işletmeleri için güvenilir bir B2B elektronik tedarik altyapısı sunmaktadır.",
  aboutusFeaturesSectionTitle: "Platformumuzda",
  aboutusPlatformFeaturesList: [
    { featureName_0: "Endüstriyel elektronik bileşenler" },
    { featureName_1: "Güç elektroniği modülleri" },
    { featureName_2: "Motor sürücü sistemleri" },
    { featureName_3: "BLDC motor çözümleri" },
    { featureName_4: "Elektrik motoru çeşitleri" },
    { featureName_5: "Mekanik ve makine yedek parçaları" },
    { featureName_6: "Mil, kaplin, rulman ve bağlantı elemanları" },
    { featureName_7: "Endüstriyel kontrol ekipmanları" }
  ],
  aboutusLeftCardTitle: "Teknik Doğrulama",
  aboutusLeftCardContent: "ZMR Elektronik’te sunulan her ürün; teknik veri sayfaları, performans parametreleri ve uygulama alanları açık şekilde tanımlanmış, endüstriyel kullanım kriterlerine uygun olarak seçilmiş ürünlerden oluşur. Amacımız yalnızca elektronik ürün satışı yapmak değil; doğru teknik bileşeni doğru uygulama ile eşleştiren sürdürülebilir bir teknik tedarik ekosistemi oluşturmaktır.",
  aboutusRightCardTitle: "Mühendislik Altyapısı",
  aboutusRightCardContent: "Elektrik motoru teknolojileri, güç elektroniği sistemleri ve endüstriyel otomasyon altyapıları alanındaki mühendislik yaklaşımımız; elektrikli tahrik sistemleri ve Ar-Ge faaliyetleri yürüten ZÜMER AR-GE Danışmanlık San. ve Tic. Ltd. Şti.’nin teknik bilgi birikimi ile desteklenmektedir. Bu güçlü altyapı sayesinde ZMR Elektronik, yalnızca bir e-ticaret sitesi değil; teknik doğrulama kültürüne sahip bir endüstriyel çözüm platformudur.",
  aboutusFooterSectionBgColor: "bg-gray-900",
  aboutusFooterSectionTitle: "Hedefimiz",
  aboutusFooterSectionDescription: "Sanayi tipi elektronik ürünler, motor sistem bileşenleri ve makine yedek parçaları alanında güvenilir, şeffaf ve teknik açıdan doğrulanmış ürünleri kullanıcıya ulaştırmak; üretim süreçlerinin kesintisiz ve verimli şekilde devam etmesine katkı sağlamaktır.",
  aboutusFooterHighlightText: "ZMR Elektronik, güvenilir iş ortağınız olmayı amaçlamaktadır."
};

export const mapApiToAboutData = (apiData: any): AboutData => {
  if (!apiData) return fallbackAboutData;

  const apiList = apiData.aboutusPlatformFeaturesList || [];
  const resultList: PlatformFeature[] = [];

  for (let idx = 0; idx < 8; idx++) {
    let featureName = "";
    if (Array.isArray(apiList)) {
      for (const obj of apiList) {
        if (obj && obj[`featureName_${idx}`] !== undefined && !featureName) {
          featureName = obj[`featureName_${idx}`];
        }
      }
    }
    const fallbackItem = fallbackAboutData.aboutusPlatformFeaturesList[idx] || fallbackAboutData.aboutusPlatformFeaturesList[0];
    const fallbackVal = fallbackItem[`featureName_${idx}`];

    resultList.push({
      [`featureName_${idx}`]: featureName || fallbackVal
    });
  }

  return {
    aboutusHeaderSectionBgColor: apiData.aboutusHeaderSectionBgColor || fallbackAboutData.aboutusHeaderSectionBgColor,
    aboutusHeaderMainTitle: apiData.aboutusHeaderMainTitle || fallbackAboutData.aboutusHeaderMainTitle,
    aboutusHeaderSubTitle: apiData.aboutusHeaderSubTitle || fallbackAboutData.aboutusHeaderSubTitle,
    aboutusIntroBoldText: apiData.aboutusIntroBoldText || fallbackAboutData.aboutusIntroBoldText,
    aboutusIntroDescriptionText: apiData.aboutusIntroDescriptionText || fallbackAboutData.aboutusIntroDescriptionText,
    aboutusFeaturesSectionTitle: apiData.aboutusFeaturesSectionTitle || fallbackAboutData.aboutusFeaturesSectionTitle,
    aboutusPlatformFeaturesList: resultList,
    aboutusLeftCardTitle: apiData.aboutusLeftCardTitle || fallbackAboutData.aboutusLeftCardTitle,
    aboutusLeftCardContent: apiData.aboutusLeftCardContent || fallbackAboutData.aboutusLeftCardContent,
    aboutusRightCardTitle: apiData.aboutusRightCardTitle || fallbackAboutData.aboutusRightCardTitle,
    aboutusRightCardContent: apiData.aboutusRightCardContent || fallbackAboutData.aboutusRightCardContent,
    aboutusFooterSectionBgColor: apiData.aboutusFooterSectionBgColor || fallbackAboutData.aboutusFooterSectionBgColor,
    aboutusFooterSectionTitle: apiData.aboutusFooterSectionTitle || fallbackAboutData.aboutusFooterSectionTitle,
    aboutusFooterSectionDescription: apiData.aboutusFooterSectionDescription || fallbackAboutData.aboutusFooterSectionDescription,
    aboutusFooterHighlightText: apiData.aboutusFooterHighlightText || fallbackAboutData.aboutusFooterHighlightText
  };
};

const getBgStyle = (bgColor: string, defaultClass: string) => {
  if (!bgColor) return { className: defaultClass, style: {} };
  const trimmed = bgColor.trim();
  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("rgb") ||
    trimmed.startsWith("hsl") ||
    trimmed.startsWith("linear-") ||
    trimmed.startsWith("radial-") ||
    trimmed.includes("gradient")
  ) {
    return { className: "text-white py-16", style: { background: trimmed } };
  }
  return { className: `${trimmed} text-white py-16`, style: {} };
};

interface AboutClientProps {
  initialData?: any;
}

const AboutClient: React.FC<AboutClientProps> = ({ initialData }) => {
  const [aboutData, setAboutData] = useState<AboutData>(() => mapApiToAboutData(initialData));

  // Sync state if initialData changes
  useEffect(() => {
    setAboutData(mapApiToAboutData(initialData));
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        if (objectId === "aboutusHeaderSectionBgColor") {
          setAboutData((prev) => ({ ...prev, aboutusHeaderSectionBgColor: value }));
        } else if (objectId === "aboutusHeaderMainTitle") {
          setAboutData((prev) => ({ ...prev, aboutusHeaderMainTitle: value }));
        } else if (objectId === "aboutusHeaderSubTitle") {
          setAboutData((prev) => ({ ...prev, aboutusHeaderSubTitle: value }));
        } else if (objectId === "aboutusIntroBoldText") {
          setAboutData((prev) => ({ ...prev, aboutusIntroBoldText: value }));
        } else if (objectId === "aboutusIntroDescriptionText") {
          setAboutData((prev) => ({ ...prev, aboutusIntroDescriptionText: value }));
        } else if (objectId === "aboutusFeaturesSectionTitle") {
          setAboutData((prev) => ({ ...prev, aboutusFeaturesSectionTitle: value }));
        } else if (objectId === "aboutusLeftCardTitle") {
          setAboutData((prev) => ({ ...prev, aboutusLeftCardTitle: value }));
        } else if (objectId === "aboutusLeftCardContent") {
          setAboutData((prev) => ({ ...prev, aboutusLeftCardContent: value }));
        } else if (objectId === "aboutusRightCardTitle") {
          setAboutData((prev) => ({ ...prev, aboutusRightCardTitle: value }));
        } else if (objectId === "aboutusRightCardContent") {
          setAboutData((prev) => ({ ...prev, aboutusRightCardContent: value }));
        } else if (objectId === "aboutusFooterSectionBgColor") {
          setAboutData((prev) => ({ ...prev, aboutusFooterSectionBgColor: value }));
        } else if (objectId === "aboutusFooterSectionTitle") {
          setAboutData((prev) => ({ ...prev, aboutusFooterSectionTitle: value }));
        } else if (objectId === "aboutusFooterSectionDescription") {
          setAboutData((prev) => ({ ...prev, aboutusFooterSectionDescription: value }));
        } else if (objectId === "aboutusFooterHighlightText") {
          setAboutData((prev) => ({ ...prev, aboutusFooterHighlightText: value }));
        } else {
          const matchFeature = objectId.match(/^featureName_(\d+)$/);
          if (matchFeature) {
            const index = parseInt(matchFeature[1], 10);
            setAboutData((prev) => {
              const newList = [...(prev.aboutusPlatformFeaturesList || [])];
              newList[index] = {
                [`featureName_${index}`]: value
              };
              return {
                ...prev,
                aboutusPlatformFeaturesList: newList
              };
            });
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const headerBg = getBgStyle(aboutData.aboutusHeaderSectionBgColor, "bg-gradient-to-r from-cyan-600 to-blue-700");
  const footerBg = getBgStyle(aboutData.aboutusFooterSectionBgColor, "bg-gray-900");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        id="aboutusHeaderSectionBgColor" 
        data-id="aboutusHeaderSectionBgColor" 
        className={headerBg.className} 
        style={headerBg.style}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            id="aboutusHeaderMainTitle" 
            data-id="aboutusHeaderMainTitle" 
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {aboutData.aboutusHeaderMainTitle}
          </h1>
          <p 
            id="aboutusHeaderSubTitle" 
            data-id="aboutusHeaderSubTitle" 
            className="text-xl text-blue-100"
          >
            {aboutData.aboutusHeaderSubTitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-t-4 border-cyan-600">
          <div className="prose max-w-none text-gray-700 space-y-6">
            <div className="text-lg leading-relaxed whitespace-pre-line">
              <span 
                id="aboutusIntroBoldText" 
                data-id="aboutusIntroBoldText" 
                className="font-bold text-gray-900"
              >
                {aboutData.aboutusIntroBoldText}
              </span>{" "}
              <span 
                id="aboutusIntroDescriptionText" 
                data-id="aboutusIntroDescriptionText"
              >
                {aboutData.aboutusIntroDescriptionText}
              </span>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-12">
          <h2 
            id="aboutusFeaturesSectionTitle" 
            data-id="aboutusFeaturesSectionTitle" 
            className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-cyan-600 pl-4"
          >
            {aboutData.aboutusFeaturesSectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aboutData.aboutusPlatformFeaturesList.map((item, index) => {
              const featureName = item[`featureName_${index}`] || "";
              return (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-3 transition-all hover:shadow-md hover:border-cyan-100 group"
                >
                  <CheckCircle className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0 group-hover:text-cyan-700" />
                  <span 
                    id={`featureName_${index}`} 
                    data-id={`featureName_${index}`} 
                    className="font-medium text-gray-700 group-hover:text-gray-900"
                  >
                    {featureName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Approach & R&D */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                <ShieldCheck className="w-6 h-6 text-cyan-700" />
              </div>
              <h2 
                id="aboutusLeftCardTitle" 
                data-id="aboutusLeftCardTitle" 
                className="text-2xl font-bold text-gray-900"
              >
                {aboutData.aboutusLeftCardTitle}
              </h2>
            </div>
            <p 
              id="aboutusLeftCardContent" 
              data-id="aboutusLeftCardContent" 
              className="text-gray-700 leading-relaxed whitespace-pre-line"
            >
              {aboutData.aboutusLeftCardContent}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-blue-700" />
              </div>
              <h2 
                id="aboutusRightCardTitle" 
                data-id="aboutusRightCardTitle" 
                className="text-2xl font-bold text-gray-900"
              >
                {aboutData.aboutusRightCardTitle}
              </h2>
            </div>
            <p 
              id="aboutusRightCardContent" 
              data-id="aboutusRightCardContent" 
              className="text-gray-700 leading-relaxed whitespace-pre-line"
            >
              {aboutData.aboutusRightCardContent}
            </p>
          </div>
        </div>

        {/* Mission/Goal */}
        <div 
          id="aboutusFooterSectionBgColor" 
          data-id="aboutusFooterSectionBgColor" 
          className="text-white rounded-2xl shadow-xl overflow-hidden relative"
          style={footerBg.style}
        >
          {/* Overlay to handle the bg color when applying tailwind classes */}
          <div className={`absolute inset-0 -z-10 ${footerBg.style.background ? "" : footerBg.className}`} />
          
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Target className="w-64 h-64 text-white" />
          </div>

          <div className="p-8 md:p-12 text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
              <Target className="w-8 h-8 text-white" />
            </div>

            <h2 
              id="aboutusFooterSectionTitle" 
              data-id="aboutusFooterSectionTitle" 
              className="text-3xl font-bold mb-6"
            >
              {aboutData.aboutusFooterSectionTitle}
            </h2>

            <p 
              id="aboutusFooterSectionDescription" 
              data-id="aboutusFooterSectionDescription" 
              className="text-lg text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed whitespace-pre-line"
            >
              {aboutData.aboutusFooterSectionDescription}
            </p>

            <div className="inline-block border-t border-gray-700 pt-8 mt-4">
              <p 
                id="aboutusFooterHighlightText" 
                data-id="aboutusFooterHighlightText" 
                className="text-xl font-medium text-cyan-400"
              >
                {aboutData.aboutusFooterHighlightText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutClient;
