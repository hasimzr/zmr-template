import { Metadata } from "next";
import { Target, CheckCircle, Settings, ShieldCheck } from "lucide-react";
import { getAboutUsApiServer } from "@/Api/controllers/ThemeController";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "ZMR Elektronik - Endüstriyel elektronik ürünler, elektrik motorları ve güç elektroniği ekipmanları alanında uzman mühendislik temelli tedarik platformu.",
};

interface AboutData {
  aboutUsId: string;
  aboutUsTextIdBold: string;
  aboutUsTextId1: string;
  aboutUsTextId2: string;
}

const getAboutData = async (): Promise<AboutData> => {
  try {
    const res = await getAboutUsApiServer();
    const data = res.data;
    
    return {
      aboutUsId: data?.aboutUsId || "ZMR Elektronik - Endüstriyel Çözüm Ortağınız",
      aboutUsTextIdBold: data?.aboutUsTextIdBold || "ZMR Elektronik",
      aboutUsTextId1: data?.aboutUsTextId1 || ", endüstriyel elektronik ürünler, elektrik motorları, güç elektroniği ekipmanları ve makine yedek parçaları alanında faaliyet gösteren mühendislik temelli bir e-ticaret ve teknik tedarik platformudur.",
      aboutUsTextId2: data?.aboutUsTextId2 || "Elektronik malzeme satışı, motor ve sürücü sistemleri, endüstriyel komponent tedariki ve makine ekipman yedek parça çözümleri konusunda uzmanlaşan ZMR Elektronik; üretim yapan firmalar, teknik servisler, proje ekipleri ve sanayi işletmeleri için güvenilir bir B2B elektronik tedarik altyapısı sunmaktadır."
    };
  } catch (error) {
    // console.error("About data fetch error:", error);
    return {
      aboutUsId: "ZMR Elektronik - Endüstriyel Çözüm Ortağınız",
      aboutUsTextIdBold: "ZMR Elektronik",
      aboutUsTextId1: ", endüstriyel elektronik ürünler, elektrik motorları, güç elektroniği ekipmanları ve makine yedek parçaları alanında faaliyet gösteren mühendislik temelli bir e-ticaret ve teknik tedarik platformudur.",
      aboutUsTextId2: "Elektronik malzeme satışı, motor ve sürücü sistemleri, endüstriyel komponent tedariki ve makine ekipman yedek parça çözümleri konusunda uzmanlaşan ZMR Elektronik; üretim yapan firmalar, teknik servisler, proje ekipleri ve sanayi işletmeleri için güvenilir bir B2B elektronik tedarik altyapısı sunmaktadır."
    };
  }
};

const About = async () => {
  const data = await getAboutData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
          <p id="aboutUsId" data-id="aboutUsId" className="text-xl text-blue-100">
            {data.aboutUsId}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-t-4 border-cyan-600">
          <div className="prose max-w-none text-gray-700 space-y-6">
            <div className="text-lg leading-relaxed">
              <span className="font-bold text-gray-900" id="aboutUsTextIdBold" data-id="aboutUsTextIdBold">{data.aboutUsTextIdBold}</span>
              <span id="aboutUsTextId1" data-id="aboutUsTextId1">{data.aboutUsTextId1}</span>
            </div>
            <p className="text-lg leading-relaxed" id="aboutUsTextId2" data-id="aboutUsTextId2">
              {data.aboutUsTextId2}
            </p>
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-cyan-600 pl-4">
            Platformumuzda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Endüstriyel elektronik bileşenler",
              "Güç elektroniği modülleri",
              "Motor sürücü sistemleri",
              "BLDC motor çözümleri",
              "Elektrik motoru çeşitleri",
              "Mekanik ve makine yedek parçaları",
              "Mil, kaplin, rulman ve bağlantı elemanları",
              "Endüstriyel kontrol ekipmanları"
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start space-x-3 transition-all hover:shadow-md hover:border-cyan-100 group">
                <CheckCircle className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0 group-hover:text-cyan-700" />
                <span className="font-medium text-gray-700 group-hover:text-gray-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Approach & R&D */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                <ShieldCheck className="w-6 h-6 text-cyan-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Teknik Doğrulama</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              ZMR Elektronik’te sunulan her ürün; teknik veri sayfaları, performans parametreleri ve uygulama alanları açık şekilde tanımlanmış, endüstriyel kullanım kriterlerine uygun olarak seçilmiş ürünlerden oluşur. Amacımız yalnızca elektronik ürün satışı yapmak değil; doğru teknik bileşeni doğru uygulama ile eşleştiren sürdürülebilir bir teknik tedarik ekosistemi oluşturmaktır.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-blue-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mühendislik Altyapısı</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Elektrik motoru teknolojileri, güç elektroniği sistemleri ve endüstriyel otomasyon altyapıları alanındaki mühendislik yaklaşımımız; elektrikli tahrik sistemleri ve Ar-Ge faaliyetleri yürüten <span className="font-semibold text-gray-900">ZÜMER AR-GE Danışmanlık San. ve Tic. Ltd. Şti.</span>’nin teknik bilgi birikimi ile desteklenmektedir. Bu güçlü altyapı sayesinde ZMR Elektronik, yalnızca bir e-ticaret sitesi değil; teknik doğrulama kültürüne sahip bir endüstriyel çözüm platformudur.
            </p>
          </div>
        </div>

        {/* Mission/Goal */}
        <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Target className="w-64 h-64 text-white" />
          </div>

          <div className="p-8 md:p-12 text-center relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/30">
              <Target className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold mb-6">Hedefimiz</h2>

            <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Sanayi tipi elektronik ürünler, motor sistem bileşenleri ve makine yedek parçaları alanında güvenilir, şeffaf ve teknik açıdan doğrulanmış ürünleri kullanıcıya ulaştırmak; üretim süreçlerinin kesintisiz ve verimli şekilde devam etmesine katkı sağlamaktır.
            </p>

            <div className="inline-block border-t border-gray-700 pt-8 mt-4">
              <p className="text-xl font-medium text-cyan-400">
                ZMR Elektronik, güvenilir iş ortağınız olmayı amaçlamaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
