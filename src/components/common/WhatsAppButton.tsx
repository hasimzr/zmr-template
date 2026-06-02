"use client";

import React, { useState, useEffect } from "react";
import { WhatsappIconData, fallbackWhatsappIconData } from "@/data/whatsappIcon";

interface Props {
  initialData?: any;
}

const mapApiToWhatsappIcon = (apiData: any): WhatsappIconData => {
  if (!apiData) return fallbackWhatsappIconData;
  return {
    whatsappIconIsShow: apiData.whatsappIconIsShow !== undefined ? String(apiData.whatsappIconIsShow) : fallbackWhatsappIconData.whatsappIconIsShow,
    whatsappIconLink: apiData.whatsappIconLink || fallbackWhatsappIconData.whatsappIconLink,
  };
};

const getHref = (link: string) => {
  if (!link) return "https://wa.me/905447267947";
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }
  if (link.includes("wa.me")) {
    return `https://${link.replace(/^(https?:\/\/)?(www\.)?/, "")}`;
  }
  const cleaned = link.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}`;
};

export default function WhatsAppButton({ initialData }: Props) {
  const [data, setData] = useState<WhatsappIconData>(() => mapApiToWhatsappIcon(initialData));

  // Sync state if server side data changes
  useEffect(() => {
    setData(mapApiToWhatsappIcon(initialData));
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        setData((prevData: WhatsappIconData) => {
          const updated = { ...prevData };
          let isListUpdated = false;

          // 1. LIST fields (not applicable here, but kept for pattern consistency)
          for (const key of Object.keys(updated)) {
            const typedKey = key as keyof WhatsappIconData;
            if (Array.isArray(updated[typedKey])) {
              updated[typedKey] = (updated[typedKey] as any).map((item: any) => {
                const newItem = { ...item };
                Object.keys(newItem).forEach((fieldKey) => {
                  if (fieldKey === objectId) {
                    newItem[fieldKey] = value;
                    isListUpdated = true;
                  }
                });
                return newItem;
              });
            }
          }

          // 2. Individual fields
          if (!isListUpdated) {
            if (objectId === "whatsappIconIsShow") updated.whatsappIconIsShow = String(value);
            if (objectId === "whatsappIconLink") updated.whatsappIconLink = String(value);
          }

          return updated;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (data.whatsappIconIsShow !== "true") {
    return (
      <div className="hidden">
        {/* Render discovery tags even if hidden, so dashboard can enable it again */}
        <span id="whatsappIconIsShow" data-id="whatsappIconIsShow" className="hidden" />
        <span id="whatsappIconLink" data-id="whatsappIconLink" className="hidden" />
      </div>
    );
  }

  const href = getHref(data.whatsappIconLink);

  return (
    <>
      {/* Discovery Tags / Elements with id/data-id for editor sync */}
      <span id="whatsappIconIsShow" data-id="whatsappIconIsShow" className="hidden" />

      <a
        id="whatsappIconLink"
        data-id="whatsappIconLink"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
