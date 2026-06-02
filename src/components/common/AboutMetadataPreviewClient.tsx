"use client";

import React, { useState, useEffect } from "react";

interface Props {
  initialData: {
    AboutUsSeoTitle?: string;
    AboutUsSeoMetaDescription?: string;
    AboutUsSeoMetaKeyWord?: string;
  } | null;
}

export default function AboutMetadataPreviewClient({ initialData }: Props) {
  const [data, setData] = useState({
    AboutUsSeoTitle: initialData?.AboutUsSeoTitle || "",
    AboutUsSeoMetaDescription: initialData?.AboutUsSeoMetaDescription || "",
    AboutUsSeoMetaKeyWord: initialData?.AboutUsSeoMetaKeyWord || "",
  });

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setData({
        AboutUsSeoTitle: initialData.AboutUsSeoTitle || "",
        AboutUsSeoMetaDescription: initialData.AboutUsSeoMetaDescription || "",
        AboutUsSeoMetaKeyWord: initialData.AboutUsSeoMetaKeyWord || "",
      });
    }
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;
        
        if (objectId === "AboutUsSeoTitle") {
          setData((prev) => ({ ...prev, AboutUsSeoTitle: value }));
          document.title = value;
        }
        if (objectId === "AboutUsSeoMetaDescription") {
          setData((prev) => ({ ...prev, AboutUsSeoMetaDescription: value }));
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
        if (objectId === "AboutUsSeoMetaKeyWord") {
          setData((prev) => ({ ...prev, AboutUsSeoMetaKeyWord: value }));
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
      <div id="AboutUsSeoTitle" data-id="AboutUsSeoTitle">{data.AboutUsSeoTitle}</div>
      <div id="AboutUsSeoMetaDescription" data-id="AboutUsSeoMetaDescription">{data.AboutUsSeoMetaDescription}</div>
      <div id="AboutUsSeoMetaKeyWord" data-id="AboutUsSeoMetaKeyWord">{data.AboutUsSeoMetaKeyWord}</div>
    </div>
  );
}
