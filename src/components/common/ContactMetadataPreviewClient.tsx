"use client";

import React, { useState, useEffect } from "react";

interface Props {
  initialData: {
    contactPageSeoTitle?: string;
    contactPageSeoMetaDescription?: string;
    contactPageSeoMetaKeyWord?: string;
  } | null;
}

export default function ContactMetadataPreviewClient({ initialData }: Props) {
  const [data, setData] = useState({
    contactPageSeoTitle: initialData?.contactPageSeoTitle || "",
    contactPageSeoMetaDescription: initialData?.contactPageSeoMetaDescription || "",
    contactPageSeoMetaKeyWord: initialData?.contactPageSeoMetaKeyWord || "",
  });

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setData({
        contactPageSeoTitle: initialData.contactPageSeoTitle || "",
        contactPageSeoMetaDescription: initialData.contactPageSeoMetaDescription || "",
        contactPageSeoMetaKeyWord: initialData.contactPageSeoMetaKeyWord || "",
      });
    }
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;
        
        if (objectId === "contactPageSeoTitle") {
          setData((prev) => ({ ...prev, contactPageSeoTitle: value }));
          document.title = value;
        }
        if (objectId === "contactPageSeoMetaDescription") {
          setData((prev) => ({ ...prev, contactPageSeoMetaDescription: value }));
          const meta = document.querySelector('meta[name="description"]');
          if (meta) {
            meta.setAttribute('content', value);
          } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'description';
            newMeta.content = value;
            document.head.appendChild(newMeta);
          }
        }
        if (objectId === "contactPageSeoMetaKeyWord") {
          setData((prev) => ({ ...prev, contactPageSeoMetaKeyWord: value }));
          const meta = document.querySelector('meta[name="keywords"]');
          if (meta) {
            meta.setAttribute('content', value);
          } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'keywords';
            newMeta.content = value;
            document.head.appendChild(newMeta);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="hidden" style={{ display: 'none' }}>
      <div id="contactPageSeoTitle" data-id="contactPageSeoTitle">{data.contactPageSeoTitle}</div>
      <div id="contactPageSeoMetaDescription" data-id="contactPageSeoMetaDescription">{data.contactPageSeoMetaDescription}</div>
      <div id="contactPageSeoMetaKeyWord" data-id="contactPageSeoMetaKeyWord">{data.contactPageSeoMetaKeyWord}</div>
    </div>
  );
}
