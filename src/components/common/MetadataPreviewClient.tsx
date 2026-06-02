"use client";

import React, { useState, useEffect } from "react";

interface Props {
  initialData: {
    hamePageTitle?: string;
    hamePageMetaDescription?: string;
    hamePageMetaKeyWord?: string;
  } | null;
}

export default function MetadataPreviewClient({ initialData }: Props) {
  const [data, setData] = useState({
    hamePageTitle: initialData?.hamePageTitle || "",
    hamePageMetaDescription: initialData?.hamePageMetaDescription || "",
    hamePageMetaKeyWord: initialData?.hamePageMetaKeyWord || "",
  });

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setData({
        hamePageTitle: initialData.hamePageTitle || "",
        hamePageMetaDescription: initialData.hamePageMetaDescription || "",
        hamePageMetaKeyWord: initialData.hamePageMetaKeyWord || "",
      });
    }
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;
        
        if (objectId === "hamePageTitle") {
          setData((prev) => ({ ...prev, hamePageTitle: value }));
          document.title = value;
        }
        if (objectId === "hamePageMetaDescription") {
          setData((prev) => ({ ...prev, hamePageMetaDescription: value }));
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
        if (objectId === "hamePageMetaKeyWord") {
          setData((prev) => ({ ...prev, hamePageMetaKeyWord: value }));
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
      <div id="hamePageTitle" data-id="hamePageTitle">{data.hamePageTitle}</div>
      <div id="hamePageMetaDescription" data-id="hamePageMetaDescription">{data.hamePageMetaDescription}</div>
      <div id="hamePageMetaKeyWord" data-id="hamePageMetaKeyWord">{data.hamePageMetaKeyWord}</div>
    </div>
  );
}

