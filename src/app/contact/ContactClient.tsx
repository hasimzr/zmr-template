"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

export interface ContactData {
  contactSectionBgGradient: string;
  contactMainTitle: string;
  contactSubTitle: string;
  contactInfoTitle: string;
  contactAddressText: string;
  contactPhoneText: string;
  contactPhoneHours: string;
  contactEmailAddress: string;
  contactEmailResponseTime: string;
  contactWorkingHoursTitle: string;
  contactWeekdaysHours: string;
  contactSaturdayHours: string;
  contactSundayHours: string;
  contactFormTitle: string;
  contactFormSubmitButtonText: string;
  contactFormSubmitButtonColor: string;
  contactWhatsappLink: string;
}

export const fallbackContactData: ContactData = {
  contactSectionBgGradient: "linear-gradient(to right, #0891b2, #1d4ed8)",
  contactMainTitle: "İletişim",
  contactSubTitle: "Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız",
  contactInfoTitle: "İletişim Bilgileri",
  contactAddressText: "KINIKLI MAH. HÜSEYİN YILMAZ CAD.\nPAMUKKALE TEKNOKENT 2 / 67 DENİZLİ / PAMUKKALE",
  contactPhoneText: "+90 544 726 79 47",
  contactPhoneHours: "Pazartesi - Cuma: 09:00 - 18:00",
  contactEmailAddress: "contact@zmrelektronik.com",
  contactEmailResponseTime: "24 saat içinde yanıt veriyoruz",
  contactWorkingHoursTitle: "Çalışma Saatleri",
  contactWeekdaysHours: "09:00 - 18:00",
  contactSaturdayHours: "10:00 - 16:00",
  contactSundayHours: "Kapalı",
  contactFormTitle: "Bize Mesaj Gönderin",
  contactFormSubmitButtonText: "Gönder",
  contactFormSubmitButtonColor: "#0891b2",
  contactWhatsappLink: "https://wa.me/905447267947"
};

export const mapApiToContactData = (apiData: any): ContactData => {
  if (!apiData) return fallbackContactData;

  const getValue = (key: keyof ContactData, fallback: string): string => {
    const val = apiData[key];
    if (val === undefined || val === null || val === "" || val === "örnek_metin") {
      return fallback;
    }
    return val;
  };

  return {
    contactSectionBgGradient: getValue("contactSectionBgGradient", fallbackContactData.contactSectionBgGradient),
    contactMainTitle: getValue("contactMainTitle", fallbackContactData.contactMainTitle),
    contactSubTitle: getValue("contactSubTitle", fallbackContactData.contactSubTitle),
    contactInfoTitle: getValue("contactInfoTitle", fallbackContactData.contactInfoTitle),
    contactAddressText: getValue("contactAddressText", fallbackContactData.contactAddressText),
    contactPhoneText: getValue("contactPhoneText", fallbackContactData.contactPhoneText),
    contactPhoneHours: getValue("contactPhoneHours", fallbackContactData.contactPhoneHours),
    contactEmailAddress: getValue("contactEmailAddress", fallbackContactData.contactEmailAddress),
    contactEmailResponseTime: getValue("contactEmailResponseTime", fallbackContactData.contactEmailResponseTime),
    contactWorkingHoursTitle: getValue("contactWorkingHoursTitle", fallbackContactData.contactWorkingHoursTitle),
    contactWeekdaysHours: getValue("contactWeekdaysHours", fallbackContactData.contactWeekdaysHours),
    contactSaturdayHours: getValue("contactSaturdayHours", fallbackContactData.contactSaturdayHours),
    contactSundayHours: getValue("contactSundayHours", fallbackContactData.contactSundayHours),
    contactFormTitle: getValue("contactFormTitle", fallbackContactData.contactFormTitle),
    contactFormSubmitButtonText: getValue("contactFormSubmitButtonText", fallbackContactData.contactFormSubmitButtonText),
    contactFormSubmitButtonColor: getValue("contactFormSubmitButtonColor", fallbackContactData.contactFormSubmitButtonColor),
    contactWhatsappLink: getValue("contactWhatsappLink", fallbackContactData.contactWhatsappLink),
  };
};

const getBgStyle = (bgColor: string, defaultClass: string) => {
  if (!bgColor) return { className: defaultClass, style: {} };
  const trimmed = bgColor.trim();
  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("rgb") ||
    trimmed.startsWith("linear-") ||
    trimmed.startsWith("radial-") ||
    trimmed.includes("gradient")
  ) {
    return { className: "text-white py-16 relative overflow-hidden", style: { background: trimmed } };
  }
  return { className: `${trimmed} text-white py-16 relative overflow-hidden`, style: {} };
};

interface ContactClientProps {
  initialData?: any;
}

const ContactClient: React.FC<ContactClientProps> = ({ initialData }) => {
  const [contactData, setContactData] = useState<ContactData>(() => mapApiToContactData(initialData));

  // Sync state if initialData changes
  useEffect(() => {
    setContactData(mapApiToContactData(initialData));
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        setContactData((prevData: any) => {
          const updated = { ...prevData };
          if (objectId in updated) {
            updated[objectId] = value;
          }
          return updated;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const headerBg = getBgStyle(contactData.contactSectionBgGradient, "bg-gradient-to-r from-cyan-600 to-blue-700");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden tags to map properties for ThemePreviewProvider/Dashboard discovery if needed */}
      <span id="contactSectionBgGradient" data-id="contactSectionBgGradient" className="hidden" />
      
      {/* Hero Section */}
      <div 
        data-id="contactSectionBgGradient" 
        className={headerBg.className} 
        style={headerBg.style}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0wIDM2YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0tMTItMTJjMS42NTYgMCAzLTEuMzQ0IDMtM3MtMS4zNDQtMy0zLTMtMyAxLjM0NC0zIDMgMS4zNDQgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            id="contactMainTitle" 
            data-id="contactMainTitle" 
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {contactData.contactMainTitle}
          </h1>
          <p 
            id="contactSubTitle" 
            data-id="contactSubTitle" 
            className="text-xl text-blue-100"
          >
            {contactData.contactSubTitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h2 
                  id="contactInfoTitle" 
                  data-id="contactInfoTitle" 
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {contactData.contactInfoTitle}
                </h2>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                  <p 
                    id="contactAddressText" 
                    data-id="contactAddressText" 
                    className="text-gray-600 whitespace-pre-line"
                  >
                    {contactData.contactAddressText}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-gray-600">
                    <a 
                      id="contactPhoneText" 
                      data-id="contactPhoneText" 
                      href={`tel:${contactData.contactPhoneText.replace(/\s+/g, "")}`} 
                      className="hover:text-cyan-600 transition-colors"
                    >
                      {contactData.contactPhoneText}
                    </a>
                  </p>
                  <p 
                    id="contactPhoneHours" 
                    data-id="contactPhoneHours" 
                    className="text-sm text-gray-500 mt-1"
                  >
                    {contactData.contactPhoneHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                  <p className="text-gray-600">
                    <a 
                      id="contactEmailAddress" 
                      data-id="contactEmailAddress" 
                      href={`mailto:${contactData.contactEmailAddress}`} 
                      className="hover:text-cyan-600 transition-colors"
                    >
                      {contactData.contactEmailAddress}
                    </a>
                  </p>
                  <p 
                    id="contactEmailResponseTime" 
                    data-id="contactEmailResponseTime" 
                    className="text-sm text-gray-500 mt-1"
                  >
                    {contactData.contactEmailResponseTime}
                  </p>
                </div>
              </div>

              {/* Çalışma Saatleri */}
              <div className="pt-6 border-t">
                <h3 
                  id="contactWorkingHoursTitle" 
                  data-id="contactWorkingHoursTitle" 
                  className="font-semibold text-gray-900 mb-3"
                >
                  {contactData.contactWorkingHoursTitle}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pazartesi - Cuma:</span>
                    <span 
                      id="contactWeekdaysHours" 
                      data-id="contactWeekdaysHours" 
                      className="font-semibold text-gray-900"
                    >
                      {contactData.contactWeekdaysHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cumartesi:</span>
                    <span 
                      id="contactSaturdayHours" 
                      data-id="contactSaturdayHours" 
                      className="font-semibold text-gray-900"
                    >
                      {contactData.contactSaturdayHours}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pazar:</span>
                    <span 
                      id="contactSundayHours" 
                      data-id="contactSundayHours" 
                      className="font-semibold text-gray-900"
                    >
                      {contactData.contactSundayHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Link */}
              {contactData.contactWhatsappLink && (
                <div className="pt-6 border-t">
                  <a
                    id="contactWhatsappLink"
                    data-id="contactWhatsappLink"
                    href={contactData.contactWhatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964-1.861-1.862-4.332-2.884-6.967-2.885-5.438 0-9.863 4.42-9.866 9.865-.001 1.77.464 3.506 1.349 5.033L1.93 21.025l5.228-1.371h-.512zm11.368-6.42c-.29-.145-1.711-.844-1.977-.94-.266-.097-.461-.145-.655.145-.193.29-.747.94-.915 1.133-.169.193-.338.217-.628.072-1.716-.857-2.836-1.5-3.967-3.438-.3-.518.3-.481.859-1.61.097-.193.048-.361-.024-.505-.072-.145-.655-1.579-.898-2.164-.236-.57-.478-.49-.655-.499-.17-.008-.363-.01-.555-.01-.193 0-.507.072-.773.361-.266.29-1.013.99-1.013 2.415 0 1.425 1.037 2.802 1.182 2.996.145.193 2.04 3.115 4.943 4.373.69.3 1.229.478 1.65.612.693.22 1.324.19 1.823.115.556-.084 1.712-.699 1.953-1.373.242-.675.242-1.253.17-1.373-.072-.12-.266-.192-.556-.338z"/>
                    </svg>
                    <span>WhatsApp Destek Hattı</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2">
            <ContactForm 
              formTitle={contactData.contactFormTitle}
              submitButtonText={contactData.contactFormSubmitButtonText}
              submitButtonColor={contactData.contactFormSubmitButtonColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
