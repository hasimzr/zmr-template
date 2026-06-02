"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignUpBannerData, fallbackSignUpBannerData } from "@/data/SignUpBanner";

interface SignUpBannerProps {
  initialData?: SignUpBannerData | null;
}

const mapApiToSignUpBanner = (apiData: any): SignUpBannerData => {
  if (!apiData) return fallbackSignUpBannerData;
  return {
    signUpBannerIsShow: apiData.signUpBannerIsShow !== undefined ? String(apiData.signUpBannerIsShow) : fallbackSignUpBannerData.signUpBannerIsShow,
    signUpBannerBgColor: apiData.signUpBannerBgColor || fallbackSignUpBannerData.signUpBannerBgColor,
    signUpBannerTitle: apiData.signUpBannerTitle || fallbackSignUpBannerData.signUpBannerTitle,
    signUpBannerDescription1: apiData.signUpBannerDescription1 || fallbackSignUpBannerData.signUpBannerDescription1,
    signUpBannerDescription2: apiData.signUpBannerDescription2 || fallbackSignUpBannerData.signUpBannerDescription2,
    signUpBannerPrimaryButtonIsShow: apiData.signUpBannerPrimaryButtonIsShow !== undefined ? String(apiData.signUpBannerPrimaryButtonIsShow) : fallbackSignUpBannerData.signUpBannerPrimaryButtonIsShow,
    signUpBannerPrimaryButtonText: apiData.signUpBannerPrimaryButtonText || fallbackSignUpBannerData.signUpBannerPrimaryButtonText,
    signUpBannerPrimaryButtonLink: apiData.signUpBannerPrimaryButtonLink || fallbackSignUpBannerData.signUpBannerPrimaryButtonLink,
    signUpBannerSecondaryButtonIsShow: apiData.signUpBannerSecondaryButtonIsShow !== undefined ? String(apiData.signUpBannerSecondaryButtonIsShow) : fallbackSignUpBannerData.signUpBannerSecondaryButtonIsShow,
    signUpBannerSecondaryButtonText: apiData.signUpBannerSecondaryButtonText || fallbackSignUpBannerData.signUpBannerSecondaryButtonText,
    signUpBannerSecondaryButtonLink: apiData.signUpBannerSecondaryButtonLink || fallbackSignUpBannerData.signUpBannerSecondaryButtonLink,
  };
};

export default function SignUpBanner({ initialData }: SignUpBannerProps) {
  const [data, setData] = useState<SignUpBannerData>(() => mapApiToSignUpBanner(initialData));

  // Sync state if server side data changes
  useEffect(() => {
    setData(mapApiToSignUpBanner(initialData));
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        setData((prevData: SignUpBannerData) => {
          const updated = { ...prevData };
          let isListUpdated = false;

          // 1. LIST fields (not applicable here, but kept for pattern consistency)
          for (const key of Object.keys(updated)) {
            const keyTyped = key as keyof SignUpBannerData;
            if (Array.isArray(updated[keyTyped])) {
              updated[keyTyped] = (updated[keyTyped] as any).map((item: any) => {
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
            if (objectId === "signUpBannerIsShow") updated.signUpBannerIsShow = String(value);
            if (objectId === "signUpBannerBgColor") updated.signUpBannerBgColor = String(value);
            if (objectId === "signUpBannerTitle") updated.signUpBannerTitle = String(value);
            if (objectId === "signUpBannerDescription1") updated.signUpBannerDescription1 = String(value);
            if (objectId === "signUpBannerDescription2") updated.signUpBannerDescription2 = String(value);
            if (objectId === "signUpBannerPrimaryButtonIsShow") updated.signUpBannerPrimaryButtonIsShow = String(value);
            if (objectId === "signUpBannerPrimaryButtonText") updated.signUpBannerPrimaryButtonText = String(value);
            if (objectId === "signUpBannerPrimaryButtonLink") updated.signUpBannerPrimaryButtonLink = String(value);
            if (objectId === "signUpBannerSecondaryButtonIsShow") updated.signUpBannerSecondaryButtonIsShow = String(value);
            if (objectId === "signUpBannerSecondaryButtonText") updated.signUpBannerSecondaryButtonText = String(value);
            if (objectId === "signUpBannerSecondaryButtonLink") updated.signUpBannerSecondaryButtonLink = String(value);
          }

          return updated;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Return null or hide element if show state is false
  if (data.signUpBannerIsShow !== "true") {
    return (
      <div className="hidden">
        {/* Render discovery tags even if hidden, so dashboard can enable it again */}
        <span id="signUpBannerIsShow" data-id="signUpBannerIsShow" className="hidden" />
      </div>
    );
  }

  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: data.signUpBannerBgColor }}
    >
      {/* Discovery Tags for Live Preview Schema Sync */}
      <span id="signUpBannerIsShow" data-id="signUpBannerIsShow" className="hidden" />
      <span id="signUpBannerBgColor" data-id="signUpBannerBgColor" className="hidden" />
      <span id="signUpBannerPrimaryButtonIsShow" data-id="signUpBannerPrimaryButtonIsShow" className="hidden" />
      <span id="signUpBannerPrimaryButtonLink" data-id="signUpBannerPrimaryButtonLink" className="hidden" />
      <span id="signUpBannerSecondaryButtonIsShow" data-id="signUpBannerSecondaryButtonIsShow" className="hidden" />
      <span id="signUpBannerSecondaryButtonLink" data-id="signUpBannerSecondaryButtonLink" className="hidden" />

      {/* Decorative SVG Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0wIDM2YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0tMTItMTJjMS42NTYgMCAzLTEuMzQ0IDMtM3MtMS4zNDQtMy0zLTMtMyAxLjM0NC0zIDMgMS4zNDQgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          data-id="signUpBannerTitle"
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight"
        >
          {data.signUpBannerTitle}
        </h2>
        
        {data.signUpBannerDescription1 && (
          <p
            data-id="signUpBannerDescription1"
            className="text-lg md:text-xl text-blue-100/80 mb-4 max-w-2xl mx-auto"
          >
            {data.signUpBannerDescription1}
          </p>
        )}

        {data.signUpBannerDescription2 && (
          <p
            data-id="signUpBannerDescription2"
            className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto"
          >
            {data.signUpBannerDescription2}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {data.signUpBannerPrimaryButtonIsShow === "true" && (
            <Link
              href={data.signUpBannerPrimaryButtonLink}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-0.5"
            >
              <span data-id="signUpBannerPrimaryButtonText">{data.signUpBannerPrimaryButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {data.signUpBannerSecondaryButtonIsShow === "true" && (
            <Link
              href={data.signUpBannerSecondaryButtonLink}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span data-id="signUpBannerSecondaryButtonText">{data.signUpBannerSecondaryButtonText}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
