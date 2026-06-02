export interface WhyUsCartItem {
  [key: string]: string;
}

export interface WhyUsData {
  WhyUsTagName: string;
  WhyUsTagColor: string;
  WhyUsTittle: string;
  WhyUsList: WhyUsCartItem[];
}

export const fallbackWhyUsData: WhyUsData = {
  WhyUsTagName: "NEDEN BİZ?",
  WhyUsTagColor: "violet",
  WhyUsTittle: "Zmrelektronik Farkı",
  WhyUsList: [
    {
      WhyUsCartBgColor_0: "#1890ff",
      WhyUsCartIcon_0: "Shield",
      WhyUsCartTitle_0: "Orijinal Ürünler",
      WhyUsCartDescription_0: "Tüm ürünlerimiz orijinal ve garantilidir. Resmi distribütörlerden tedarik ediyoruz.",
    },
    {
      WhyUsCartBgColor_1: "#10b981",
      WhyUsCartIcon_1: "ShoppingBag",
      WhyUsCartTitle_1: "Geniş Ürün Yelpazesi",
      WhyUsCartDescription_1: "10.000+ elektronik bileşen, geliştirme kartı, sensör ve modül çeşidi ile hizmetinizdeyiz.",
    },
    {
      WhyUsCartBgColor_2: "#8b5cf6",
      WhyUsCartIcon_2: "Headphones",
      WhyUsCartTitle_2: "Teknik Destek",
      WhyUsCartDescription_2: "Uzman mühendislerimiz proje geliştirme sürecinizde size rehberlik eder.",
    },
    {
      WhyUsCartBgColor_3: "#f59e0b",
      WhyUsCartIcon_3: "Truck",
      WhyUsCartTitle_3: "Hızlı Kargo",
      WhyUsCartDescription_3: "Siparişleriniz aynı gün kargoya verilir ve en kısa sürede adresinize ulaştırılır.",
    },
  ],
};
