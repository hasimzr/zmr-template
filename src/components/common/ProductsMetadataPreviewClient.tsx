"use client";

import React, { useState, useEffect } from "react";

interface Props {
  initialData: {
    productsPageTitle?: string;
    productsPageMetaDescription?: string;
    productsPageMetaKeyWord?: string;
  } | null;
}

export default function ProductsMetadataPreviewClient({ initialData }: Props) {
  const [data, setData] = useState({
    productsPageTitle: initialData?.productsPageTitle || "",
    productsPageMetaDescription: initialData?.productsPageMetaDescription || "",
    productsPageMetaKeyWord: initialData?.productsPageMetaKeyWord || "",
  });

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setData({
        productsPageTitle: initialData.productsPageTitle || "",
        productsPageMetaDescription: initialData.productsPageMetaDescription || "",
        productsPageMetaKeyWord: initialData.productsPageMetaKeyWord || "",
      });
    }
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;
        
        if (objectId === "productsPageTitle") {
          setData((prev) => ({ ...prev, productsPageTitle: value }));
          document.title = value;
        }
        if (objectId === "productsPageMetaDescription") {
          setData((prev) => ({ ...prev, productsPageMetaDescription: value }));
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
        if (objectId === "productsPageMetaKeyWord") {
          setData((prev) => ({ ...prev, productsPageMetaKeyWord: value }));
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
      <div id="productsPageTitle" data-id="productsPageTitle">{data.productsPageTitle}</div>
      <div id="productsPageMetaDescription" data-id="productsPageMetaDescription">{data.productsPageMetaDescription}</div>
      <div id="productsPageMetaKeyWord" data-id="productsPageMetaKeyWord">{data.productsPageMetaKeyWord}</div>
    </div>
  );
}
