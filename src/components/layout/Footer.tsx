"use client";
import { useState } from "react";
import Link from "next/link";;
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "@/assets/logo.png";
import ModalComponent from "../ModalCompanent";
import {
  PRELIMINARY_INFORMATION_FORM,
  DISTANCE_SALES_AGREEMENT,
  KVKK_TEXT,
  CANCELLATION_AND_RETURN_CONDITIONS,
  COOKIE_POLICY,
} from "@/data/contracts";

const Footer = () => {
  const [showPreliminaryModal, setShowPreliminaryModal] = useState(false);
  const [showDistanceSalesModal, setShowDistanceSalesModal] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showCookiePolicyModal, setShowCookiePolicyModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-5">
                <img src={logo.src} alt="Zmrelektronik Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-black text-white tracking-tight">
                  Zmr<span className="text-cyan-400">elektronik</span>
                </span>
              </Link>
              <p className="text-sm mb-5 leading-relaxed text-gray-500">
                Geliştiriciler, mühendisler ve hobi tutkunları için en geniş
                elektronik bileşen çeşitliliği.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">
                Hızlı Bağlantılar
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { to: "/", label: "Ana Sayfa" },
                  { to: "/products", label: "Tüm Ürünler" },
                  { to: "/about", label: "Hakkımızda" },
                  { to: "/contact", label: "İletişim" },
                  { to: "/faq", label: "SSS" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      href={to}
                      className="text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">
                Müşteri Hizmetleri
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => setShowKvkkModal(true)}
                    className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-left"
                  >
                    KVKK ve Gizlilik Politikası
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowCookiePolicyModal(true)}
                    className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-left"
                  >
                    Çerez Politikası
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPreliminaryModal(true)}
                    className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-left"
                  >
                    Ön Bilgilendirme Formu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowDistanceSalesModal(true)}
                    className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-left"
                  >
                    Mesafeli Satış Sözleşmesi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowCancellationModal(true)}
                    className="text-gray-500 hover:text-cyan-400 transition-colors duration-200 text-left"
                  >
                    İptal ve İade Şartları
                  </button>
                </li>
                {[
                  { to: "/cart", label: "Sepetim" },
                  { to: "/dashboard", label: "Siparişlerim" },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      href={to}
                      className="text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-sm font-bold mb-5 uppercase tracking-wider">
                İletişim
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-500">
                    KINIKLI MAH. HÜSEYİN YILMAZ CAD.
                    <br />
                    NO:67/4 D BLOK/ KAT:1 PAMUKKALE/ DENİZLİ
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a
                    href="tel:+905447267947"
                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    +90 544 726 79 47
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <a
                    href="mailto:contact@zmrelektronik.com"
                    className="text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    contact@zmrelektronik.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © 2024 Zmrelektronik. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <button
                onClick={() => setShowKvkkModal(true)}
                className="hover:text-gray-400 transition-colors"
              >
                Gizlilik
              </button>
              <button
                onClick={() => setShowCookiePolicyModal(true)}
                className="hover:text-gray-400 transition-colors"
              >
                Çerezler
              </button>
              <button
                onClick={() => setShowDistanceSalesModal(true)}
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

      {/* Ön Bilgilendirme Formu Modal */}
      <ModalComponent
        isOpen={showPreliminaryModal}
        onClose={() => setShowPreliminaryModal(false)}
        title="Ön Bilgilendirme Formu"
        size="lg"
      >
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
          {PRELIMINARY_INFORMATION_FORM}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowPreliminaryModal(false)}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* Mesafeli Satış Sözleşmesi Modal */}
      <ModalComponent
        isOpen={showDistanceSalesModal}
        onClose={() => setShowDistanceSalesModal(false)}
        title="Mesafeli Satış Sözleşmesi"
        size="lg"
      >
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
          {DISTANCE_SALES_AGREEMENT}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowDistanceSalesModal(false)}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* KVKK Modal */}
      <ModalComponent
        isOpen={showKvkkModal}
        onClose={() => setShowKvkkModal(false)}
        title="KVKK Aydınlatma Metni ve Gizlilik Politikası"
        size="lg"
      >
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
          {KVKK_TEXT}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowKvkkModal(false)}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* İptal ve İade Modal */}
      <ModalComponent
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        title="İptal, İade ve Cayma Hakkı Şartları"
        size="lg"
      >
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
          {CANCELLATION_AND_RETURN_CONDITIONS}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowCancellationModal(false)}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* Çerez Politikası Modal */}
      <ModalComponent
        isOpen={showCookiePolicyModal}
        onClose={() => setShowCookiePolicyModal(false)}
        title="Çerez Politikası"
        size="lg"
      >
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed font-sans whitespace-pre-wrap">
          {COOKIE_POLICY}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowCookiePolicyModal(false)}
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>
    </>
  );
};

export default Footer;
