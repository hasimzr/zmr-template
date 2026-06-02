"use client";

import React, { useState, useEffect } from "react";

interface Props {
  initialData: {
    generalSeoTitle?: string;
    generalSeoMetaDescription?: string;
    generalSeoMetaKeyWord?: string;
  } | null;
}

export default function GeneralMetadataPreviewClient({ initialData }: Props) {
  const [data, setData] = useState({
    generalSeoTitle: initialData?.generalSeoTitle || "",
    generalSeoMetaDescription: initialData?.generalSeoMetaDescription || "",
    generalSeoMetaKeyWord: initialData?.generalSeoMetaKeyWord || "",
  });

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setData({
        generalSeoTitle: initialData.generalSeoTitle || "",
        generalSeoMetaDescription: initialData.generalSeoMetaDescription || "",
        generalSeoMetaKeyWord: initialData.generalSeoMetaKeyWord || "",
      });
    }
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;
        
        if (objectId === "generalSeoTitle") {
          setData((prev) => ({ ...prev, generalSeoTitle: value }));
          
          const currentTitle = document.title;
          if (currentTitle.includes("|")) {
            const parts = currentTitle.split("|");
            document.title = `${parts[0].trim()} | ${value}`;
          } else if (currentTitle.includes(" - ")) {
            const parts = currentTitle.split(" - ");
            const firstPartLower = parts[0].trim().toLowerCase();
            if (firstPartLower === "zmrelektronik" || firstPartLower === "zmr elektronik") {
              document.title = `${value} - ${parts.slice(1).join(" - ").trim()}`;
            } else {
              document.title = `${parts[0].trim()} - ${value}`;
            }
          } else {
            document.title = value;
          }
        }
        if (objectId === "generalSeoMetaDescription") {
          setData((prev) => ({ ...prev, generalSeoMetaDescription: value }));
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
        if (objectId === "generalSeoMetaKeyWord") {
          setData((prev) => ({ ...prev, generalSeoMetaKeyWord: value }));
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
      <div id="generalSeoTitle" data-id="generalSeoTitle">{data.generalSeoTitle}</div>
      <div id="generalSeoMetaDescription" data-id="generalSeoMetaDescription">{data.generalSeoMetaDescription}</div>
      <div id="generalSeoMetaKeyWord" data-id="generalSeoMetaKeyWord">{data.generalSeoMetaKeyWord}</div>
    </div>
  );
}
