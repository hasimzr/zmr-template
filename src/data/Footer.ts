export interface FooterLinkItem {
  [key: string]: string;
}

export interface FooterData {
  footerBgColor: string;
  footerDescriptionText: string;
  footerCopyrightText: string;
  footerColumn1Title: string;
  footerColumn1Links: FooterLinkItem[];
  footerColumn2Title: string;
  footerColumn3Title: string;
  footerAddressText: string;
  footerPhoneText: string;
  footerEmailText: string;
  footerWhatsappIsShow: string;
  footerWhatsappLink: string;
  footerLogoIsShow: string;
}

export const fallbackFooterData: FooterData = {
  footerBgColor: "#111827",
  footerDescriptionText: "Geliştiriciler, mühendisler ve hobi tutkunları için en geniş elektronik bileşen çeşitliliği.",
  footerCopyrightText: "© 2024 Zmrelektronik. Tüm hakları saklıdır.",
  footerColumn1Title: "Hızlı Bağlantılar",
  footerColumn1Links: [
    { "linkText_0": "Ana Sayfa", "linkUrl_0": "/" },
    { "linkText_1": "Tüm Ürünler", "linkUrl_1": "/products" },
    { "linkText_2": "Hakkımızda", "linkUrl_2": "/about" },
    { "linkText_3": "İletişim", "linkUrl_3": "/contact" },
    { "linkText_4": "SSS", "linkUrl_4": "/faq" },
  ],
  footerColumn2Title: "Müşteri Hizmetleri",
  footerColumn3Title: "İletişim",
  footerAddressText: "KINIKLI MAH. HÜSEYİN YILMAZ CAD. NO:67/4 D BLOK/ KAT:1 PAMUKKALE/ DENİZLİ",
  footerPhoneText: "+90 544 726 79 47",
  footerEmailText: "contact@zmrelektronik.com",
  footerWhatsappIsShow: "true",
  footerWhatsappLink: "https://wa.me/905447267947",
  footerLogoIsShow: "true",
};
