"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { LogoAndNameData } from "@/types";
import logo from "@/assets/logo.png";
import ModalComponent from "../ModalCompanent";
import { FooterData, fallbackFooterData } from "@/data/Footer";
import {
  PRELIMINARY_INFORMATION_FORM,
  DISTANCE_SALES_AGREEMENT,
  KVKK_TEXT,
  CANCELLATION_AND_RETURN_CONDITIONS,
  COOKIE_POLICY,
} from "@/data/contracts";

interface FooterProps {
  logoAndNameData?: LogoAndNameData;
  initialData?: any;
  initialContractsData?: any;
}

interface FooterState extends FooterData {
  contractsList: any[];
}

export const fallbackContractsList: any[] = [
  {
    contractTitle_0: "KVKK Aydınlatma Metni ve Gizlilik Politikası",
    contractDetail_0: KVKK_TEXT,
  },
  {
    contractTitle_1: "Çerez Politikası",
    contractDetail_1: COOKIE_POLICY,
  },
  {
    contractTitle_2: "Ön Bilgilendirme Formu",
    contractDetail_2: PRELIMINARY_INFORMATION_FORM,
  },
  {
    contractTitle_3: "Mesafeli Satış Sözleşmesi",
    contractDetail_3: DISTANCE_SALES_AGREEMENT,
  },
  {
    contractTitle_4: "İptal ve İade Şartları",
    contractDetail_4: CANCELLATION_AND_RETURN_CONDITIONS,
  }
];
export const normalizeContractItem = (item: any, index: number) => {
  if (!item) return {};
  const titleKey = `contractTitle_${index}`;
  const detailKey = `contractDetail_${index}`;
  
  const title = item[titleKey] || item.contractTitle || "";
  const detail = item[detailKey] || item.contractDetail || "";
  
  return {
    [titleKey]: title,
    [detailKey]: detail,
    contractTitle: title,
    contractDetail: detail,
  };
};

export const mapApiToContracts = (apiData: any) => {
  const rawList = apiData && Array.isArray(apiData)
    ? apiData
    : (apiData && Array.isArray(apiData.contractsList) ? apiData.contractsList : null);

  if (!rawList || rawList.length === 0) {
    return fallbackContractsList.map((item, index) => normalizeContractItem(item, index));
  }
  return rawList.map((item: any, index: number) => normalizeContractItem(item, index));
};

const mapApiToFooter = (apiData: any): FooterData => {
  if (!apiData) return fallbackFooterData;
  return {
    footerBgColor: apiData.footerBgColor || fallbackFooterData.footerBgColor,
    footerDescriptionText: apiData.footerDescriptionText || fallbackFooterData.footerDescriptionText,
    footerCopyrightText: apiData.footerCopyrightText || fallbackFooterData.footerCopyrightText,
    footerColumn1Title: apiData.footerColumn1Title || fallbackFooterData.footerColumn1Title,
    footerColumn1Links: Array.isArray(apiData.footerColumn1Links) ? apiData.footerColumn1Links : fallbackFooterData.footerColumn1Links,
    footerColumn2Title: apiData.footerColumn2Title || fallbackFooterData.footerColumn2Title,
    footerColumn3Title: apiData.footerColumn3Title || fallbackFooterData.footerColumn3Title,
    footerAddressText: apiData.footerAddressText || fallbackFooterData.footerAddressText,
    footerPhoneText: apiData.footerPhoneText || fallbackFooterData.footerPhoneText,
    footerEmailText: apiData.footerEmailText || fallbackFooterData.footerEmailText,
    footerWhatsappIsShow: apiData.footerWhatsappIsShow !== undefined ? String(apiData.footerWhatsappIsShow) : fallbackFooterData.footerWhatsappIsShow,
    footerWhatsappLink: apiData.footerWhatsappLink || fallbackFooterData.footerWhatsappLink,
    footerLogoIsShow: apiData.footerLogoIsShow !== undefined ? String(apiData.footerLogoIsShow) : fallbackFooterData.footerLogoIsShow,
  };
};

const Footer: React.FC<FooterProps> = ({ logoAndNameData, initialData, initialContractsData }) => {
  const [data, setData] = useState<FooterState>(() => ({
    ...mapApiToFooter(initialData),
    contractsList: mapApiToContracts(initialContractsData)
  }));
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const displayLogo = logoAndNameData?.Logo || logo.src;
  const siteName = logoAndNameData?.SiteNamePrimaryTitle || "Zmrelektronik";

  const splitSiteName = (title: string): { black: string; primary: string } => {
    if (!title) return { black: "Zmr", primary: "elektronik" };
    const spaceIndex = title.indexOf(" ");
    if (spaceIndex !== -1) {
      return {
        black: title.substring(0, spaceIndex),
        primary: title.substring(spaceIndex + 1)
      };
    }
    const lowerTitle = title.toLowerCase();
    const idx = lowerTitle.indexOf("elektronik");
    if (idx !== -1) {
      return {
        black: title.substring(0, idx),
        primary: title.substring(idx)
      };
    }
    const idx2 = lowerTitle.indexOf("elektronx");
    if (idx2 !== -1) {
      return {
        black: title.substring(0, idx2),
        primary: title.substring(idx2)
      };
    }
    if (lowerTitle.startsWith("zmr") && title.length > 3) {
      return {
        black: title.substring(0, 3),
        primary: title.substring(3)
      };
    }
    return {
      black: title,
      primary: ""
    };
  };

  const { black: displaySiteNameBlack, primary: displaySiteNamePrimary } = splitSiteName(siteName);

  // Sync state if server side data changes
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...mapApiToFooter(initialData),
    }));
  }, [initialData]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      contractsList: mapApiToContracts(initialContractsData),
    }));
  }, [initialContractsData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;

        setData((prevData: FooterState) => {
          const updated = { ...prevData };
          let isListUpdated = false;

          // 1. Komple Liste güncellemelerini kontrol et (Ekleme/Silme durumları için)
          for (const key of Object.keys(updated)) {
            const keyTyped = key as keyof FooterState;
            if (key === objectId && Array.isArray(value)) {
              if (key === "contractsList") {
                updated.contractsList = mapApiToContracts(value);
              } else {
                updated[keyTyped] = value as any;
              }
              isListUpdated = true;
            }
          }

          // 2. LIST içindeki tekil alanları güncelle
          if (!isListUpdated) {
            for (const key of Object.keys(updated)) {
              const keyTyped = key as keyof FooterState;
              if (Array.isArray(updated[keyTyped])) {
                updated[keyTyped] = (updated[keyTyped] as any).map((item: any, index: number) => {
                  const newItem = { ...item };
                  Object.keys(newItem).forEach(fieldKey => {
                    if (fieldKey === objectId) {
                      newItem[fieldKey] = value;
                      isListUpdated = true;
                      
                      // Suffixed and non-suffixed keys sync
                      if (fieldKey.startsWith("contractTitle")) {
                        newItem.contractTitle = value;
                        newItem[`contractTitle_${index}`] = value;
                      } else if (fieldKey.startsWith("contractDetail")) {
                        newItem.contractDetail = value;
                        newItem[`contractDetail_${index}`] = value;
                      }
                    }
                  });
                  return newItem;
                });
              }
            }
          }

          // 3. Tekil (normal) alanları güncelle
          if (!isListUpdated) {
            if (objectId === "footerBgColor") updated.footerBgColor = value;
            if (objectId === "footerDescriptionText") updated.footerDescriptionText = value;
            if (objectId === "footerCopyrightText") updated.footerCopyrightText = value;
            if (objectId === "footerColumn1Title") updated.footerColumn1Title = value;
            if (objectId === "footerColumn2Title") updated.footerColumn2Title = value;
            if (objectId === "footerColumn3Title") updated.footerColumn3Title = value;
            if (objectId === "footerAddressText") updated.footerAddressText = value;
            if (objectId === "footerPhoneText") updated.footerPhoneText = value;
            if (objectId === "footerEmailText") updated.footerEmailText = value;
            if (objectId === "footerWhatsappIsShow") updated.footerWhatsappIsShow = String(value);
            if (objectId === "footerWhatsappLink") updated.footerWhatsappLink = value;
            if (objectId === "footerLogoIsShow") updated.footerLogoIsShow = String(value);
          }

          return updated;
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <footer
        data-id="footerBgColor"
        className="text-gray-400 mt-auto transition-colors duration-500"
        style={{ backgroundColor: data.footerBgColor }}
      >
        {/* Discovery tags for live preview schema sync */}
        <span id="footerBgColor" data-id="footerBgColor" className="hidden" />
        <span id="footerDescriptionText" data-id="footerDescriptionText" className="hidden" />
        <span id="footerCopyrightText" data-id="footerCopyrightText" className="hidden" />
        <span id="footerColumn1Title" data-id="footerColumn1Title" className="hidden" />
        <span id="footerColumn2Title" data-id="footerColumn2Title" className="hidden" />
        <span id="footerColumn3Title" data-id="footerColumn3Title" className="hidden" />
        <span id="footerAddressText" data-id="footerAddressText" className="hidden" />
        <span id="footerPhoneText" data-id="footerPhoneText" className="hidden" />
        <span id="footerEmailText" data-id="footerEmailText" className="hidden" />
        <span id="footerWhatsappIsShow" data-id="footerWhatsappIsShow" className="hidden" />
        <span id="footerWhatsappLink" data-id="footerWhatsappLink" className="hidden" />
        <span id="footerLogoIsShow" data-id="footerLogoIsShow" className="hidden" />

        {/* Discovery tags for contracts live preview schema sync */}
        {data.contractsList?.map((item: any, index: number) => {
          const titleKey = `contractTitle_${index}`;
          const detailKey = `contractDetail_${index}`;
          return (
            <span key={index} className="hidden">
              <span id={titleKey} data-id={titleKey} />
              <span id={detailKey} data-id={detailKey} />
            </span>
          );
        })}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              {data.footerLogoIsShow === "true" && (
                <Link href="/" className="flex items-center gap-2 mb-5">
                  <img
                    src={displayLogo}
                    data-id="Logo"
                    alt={`${siteName} Logo`}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xl font-black text-white tracking-tight">
                    <span data-id="SiteNameBlackTitle">{displaySiteNameBlack}</span>
                    <span data-id="SiteNamePrimaryTitle" className="text-cyan-400">{displaySiteNamePrimary}</span>
                  </span>
                </Link>
              )}
              <p data-id="footerDescriptionText" className="text-sm mb-5 leading-relaxed text-gray-500">
                {data.footerDescriptionText}
              </p>
            </div>

            {/* Column 1 (Quick Links) */}
            <div>
              <h3 data-id="footerColumn1Title" className="text-white text-sm font-bold mb-5 uppercase tracking-wider">
                {data.footerColumn1Title}
              </h3>
              <ul className="space-y-3 text-sm">
                {data.footerColumn1Links?.map((item: any, index: number) => {
                  const textKey = `linkText_${index}`;
                  const urlKey = `linkUrl_${index}`;
                  const linkText = item[textKey] || "";
                  const linkUrl = item[urlKey] || "#";
                  return (
                    <li key={index}>
                      <Link
                        href={linkUrl}
                        className="text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                      >
                        <span data-id={textKey}>{linkText}</span>
                        <span data-id={urlKey} className="hidden" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 2 (Customer Support) */}
            <div>
              <h3 data-id="footerColumn2Title" className="text-white text-sm font-bold mb-5 uppercase tracking-wider">
                {data.footerColumn2Title}
              </h3>
              <ul className="space-y-3 text-sm">
                {data.contractsList?.map((item: any, index: number) => {
                  const titleKey = `contractTitle_${index}`;
                  const detailKey = `contractDetail_${index}`;
                  const title = item[titleKey] || "";
                  if (!title) return null;

                  const domain = typeof window !== "undefined" ? window.location.host : "zmrelektronik.com";
                  const displayTitle = title
                    .replace(/zmrelektronik\.com/gi, domain)
                    .replace(/Zmrelektronik/gi, siteName)
                    .replace(/ZmrElektronik/gi, siteName)
                    .replace(/ZMR Elektronik/gi, siteName);

                  return (
                    <li key={index}>
                      <button
                        onClick={() => setActiveModalIndex(index)}
                        className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-left"
                      >
                        <span data-id={titleKey}>{displayTitle}</span>
                        <span data-id={detailKey} className="hidden" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3 (Contact) */}
            <div>
              <h3 data-id="footerColumn3Title" className="text-white text-sm font-bold mb-5 uppercase tracking-wider">
                {data.footerColumn3Title}
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span data-id="footerAddressText" className="text-gray-500">
                    {data.footerAddressText}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a
                    href={`tel:${data.footerPhoneText}`}
                    data-id="footerPhoneText"
                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {data.footerPhoneText}
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a
                    href={`mailto:${data.footerEmailText}`}
                    data-id="footerEmailText"
                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {data.footerEmailText}
                  </a>
                </li>
                {data.footerWhatsappIsShow === "true" && (
                  <li className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 text-green-400 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <a
                      href={data.footerWhatsappLink}
                      data-id="footerWhatsappLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      WhatsApp Destek
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p data-id="footerCopyrightText" className="text-xs text-gray-600">
              {data.footerCopyrightText}
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <button
                onClick={() => {
                  const idx = data.contractsList?.findIndex((item: any, i: number) => {
                    const title = (item[`contractTitle_${i}`] || "").toLowerCase();
                    return title.includes("gizlilik") || title.includes("kvkk");
                  });
                  if (idx !== -1 && idx !== undefined) setActiveModalIndex(idx);
                  else setActiveModalIndex(0);
                }}
                className="hover:text-gray-400 transition-colors"
              >
                Gizlilik
              </button>
              <button
                onClick={() => {
                  const idx = data.contractsList?.findIndex((item: any, i: number) => {
                    const title = (item[`contractTitle_${i}`] || "").toLowerCase();
                    return title.includes("çerez") || title.includes("cookie");
                  });
                  if (idx !== -1 && idx !== undefined) setActiveModalIndex(idx);
                  else setActiveModalIndex(1);
                }}
                className="hover:text-gray-400 transition-colors"
              >
                Çerezler
              </button>
              <button
                onClick={() => {
                  const idx = data.contractsList?.findIndex((item: any, i: number) => {
                    const title = (item[`contractTitle_${i}`] || "").toLowerCase();
                    return title.includes("mesafeli") || title.includes("satış") || title.includes("şart");
                  });
                  if (idx !== -1 && idx !== undefined) setActiveModalIndex(idx);
                  else setActiveModalIndex(3);
                }}
                className="hover:text-gray-400 transition-colors"
              >
                Şartlar
              </button>
              <Link href="/faq" className="hover:text-gray-400 transition-colors">
                SSS
              </Link>
            </div>
          </div>
        </div>
      </footer>

       {/* Dynamic Contracts Modal */}
      {activeModalIndex !== null && data.contractsList?.[activeModalIndex] && (() => {
        const titleKey = `contractTitle_${activeModalIndex}`;
        const detailKey = `contractDetail_${activeModalIndex}`;
        const item = data.contractsList[activeModalIndex];
        const title = item[titleKey] || "";
        const detail = item[detailKey] || "";

        const domain = typeof window !== "undefined" ? window.location.host : "zmrelektronik.com";
        const displayTitle = title
          .replace(/zmrelektronik\.com/gi, domain)
          .replace(/Zmrelektronik/gi, siteName)
          .replace(/ZmrElektronik/gi, siteName)
          .replace(/ZMR Elektronik/gi, siteName);

        const displayDetail = detail
          .replace(/zmrelektronik\.com/gi, domain)
          .replace(/Zmrelektronik/gi, siteName)
          .replace(/ZmrElektronik/gi, siteName)
          .replace(/ZMR Elektronik/gi, siteName);

        return (
          <ModalComponent
            isOpen={activeModalIndex !== null}
            onClose={() => setActiveModalIndex(null)}
            title={displayTitle}
            size="lg"
          >
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
              <span data-id={detailKey}>{displayDetail}</span>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setActiveModalIndex(null)}
                className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Kapat
              </button>
            </div>
          </ModalComponent>
        );
      })()}
    </>
  );
};

export default Footer;
