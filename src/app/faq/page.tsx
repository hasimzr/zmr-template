import { Metadata } from "next";
import FAQContent, { FAQItem } from "./FAQContent";
import { getGeneralTitleAndMateTagApiServer } from "@/Api/controllers/ThemeController";

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

  return {
    title: "Sık Sorulan Sorular",
    description: `${brandName} hakkında sık sorulan sorular. Sipariş, ödeme, iade ve üyelik süreçleri hakkında bilgi edinin.`,
  };
}

const faqData: FAQItem[] = [
  {
    category: "Sipariş ve Teslimat",
    question: "Siparişim ne zaman kargoya verilir?",
    answer:
      "Siparişiniz onaylandıktan sonra 1-2 iş günü içinde kargoya verilir. Kargo sürecini hesabınızdan takip edebilirsiniz.",
  },
  {
    category: "Sipariş ve Teslimat",
    question: "Kargo ücreti ne kadar?",
    answer:
      "500 TL ve üzeri alışverişlerde kargo ücretsizdir. 500 TL altı alışverişlerde sabit 29.90 TL kargo ücreti uygulanır.",
  },
  {
    category: "Sipariş ve Teslimat",
    question: "Siparişimi nasıl takip edebilirim?",
    answer:
      'Hesabınıza giriş yaparak "Siparişlerim" bölümünden sipariş durumunuzu ve kargo takip numaranızı görebilirsiniz.',
  },
  {
    category: "Ödeme",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm kredi kartlarında taksit seçenekleri mecurttur.",
  },
  {
    category: "Ödeme",
    question: "Ödeme bilgilerim güvende mi?",
    answer:
      "Evet, tüm ödeme işlemleriniz 256-bit SSL sertifikası ile güvence altındadır. Kart bilgileriniz kesinlikle saklanmaz.",
  },
  {
    category: "İade ve Değişim",
    question: "Ürünü iade edebilir miyim?",
    answer:
      "Ürün teslim tarihinden itibaren 14 gün içinde kullanılmamış ve hasarsız olması koşuluyla ücretsiz iade yapabilirsiniz.",
  },
  {
    category: "İade ve Değişim",
    question: "İade sürecim ne kadar sürer?",
    answer:
      "İade ettiğiniz ürün tarafımıza ulaştıktan sonra 3-5 iş günü içinde ödemeniz tarafınıza iade edilir.",
  },
  {
    category: "İade ve Değişim",
    question: "Ürün değişimi yapabilir miyim?",
    answer:
      "Evet, aynı ürünün farklı bedeni veya rengi ile değişim yapabilirsiniz. Değişim işlemi için müşteri hizmetleri ile iletişime geçin.",
  },
  {
    category: "Hesap ve Üyelik",
    question: "Üye olmadan sipariş verebilir miyim?",
    answer:
      "Hayır, güvenli alışveriş deneyimi için üyelik zorunludur. Üyelik işlemi sadece birkaç dakika sürer.",
  },
  {
    category: "Hesap ve Üyelik",
    question: "Şifremi unuttum, ne yapmalıyım?",
    answer:
      'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama linki gönderebilirsiniz.',
  },
  {
    category: "Genel",
    question: "Müşteri hizmetlerine nasıl ulaşabilirim?",
    answer:
      "İletişim sayfamızdan bize ulaşabilir veya info@eshop.com adresine e-posta gönderebilirsiniz. Telefon: +90 (212) 123 45 67",
  },
  {
    category: "Genel",
    question: "Toplu alım indirimi var mı?",
    answer:
      "Kurumsal ve toplu alımlar için özel fiyatlandırma sunuyoruz. Detaylı bilgi için kurumsal@eshop.com adresine mail atabilirsiniz.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sık Sorulan Sorular
          </h1>
          <p className="text-xl text-blue-100">
            Aklınıza takılan soruların cevaplarını bulabilirsiniz
          </p>
        </div>
      </div>

      <FAQContent faqData={faqData} />
    </div>
  );
};

export default FAQ;
