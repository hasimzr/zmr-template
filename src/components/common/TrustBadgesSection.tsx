"use client";

import React, { useState, useEffect } from "react";
import { trustBadgesSectionData } from "@/data/TrustBadgesSection";
import {
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  ShoppingCart,
  ShoppingBag,
  Receipt,
  CreditCard,
} from "lucide-react";

interface TrustBadgesSectionProps {
  initialBadges?: any[] | null;
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Truck":
      return Truck;
    case "Shield":
      return Shield;
    case "Headphones":
      return Headphones;
    case "RotateCcw":
      return RotateCcw;
    case "ShoppingCart":
      return ShoppingCart;
    case "ShoppingBag":
      return ShoppingBag;
    case "Receipt":
      return Receipt;
    case "CreditCard":
      return CreditCard;
    default:
      return Truck;
  }
};

const getBadgeStyles = (color: string) => {
  if (!color) {
    return {
      bgClass: "bg-blue-50 ring-blue-100",
      textClass: "text-blue-600",
      inlineStyle: {},
    };
  }

  if (colorMap[color]) {
    return {
      bgClass: `${colorMap[color].bg} ring-1 ${colorMap[color].ring}`,
      textClass: colorMap[color].text,
      inlineStyle: {},
    };
  }

  // Hex color or custom color
  return {
    bgClass: "",
    textClass: "",
    inlineStyle: {
      container: {
        backgroundColor: color.startsWith("#") ? `${color}15` : color,
        boxShadow: color.startsWith("#") ? `inset 0 0 0 1px ${color}30` : "none",
      },
      text: {
        color: color,
      },
    },
  };
};

const mapApiToBadges = (apiList: any[] | null | undefined): any[] => {
  const result: any[] = [];
  for (let idx = 0; idx < 4; idx++) {
    let icon = "";
    let color = "";
    let title = "";
    let description = "";

    // Try to find the keys in the apiList array
    if (apiList && Array.isArray(apiList)) {
      for (const obj of apiList) {
        if (obj[`SiteIconsIcon_${idx}`] !== undefined && !icon) {
          icon = obj[`SiteIconsIcon_${idx}`];
        }
        if (obj[`SiteIconsColor_${idx}`] !== undefined && !color) {
          color = obj[`SiteIconsColor_${idx}`];
        }
        if (obj[`SiteIconsTitle_${idx}`] !== undefined && !title) {
          title = obj[`SiteIconsTitle_${idx}`];
        }
        if (obj[`SiteIconsDescription_${idx}`] !== undefined && !description) {
          description = obj[`SiteIconsDescription_${idx}`];
        }
      }
    }

    // Fallback to static data
    const fallbackItem = trustBadgesSectionData[idx] || trustBadgesSectionData[0];
    result.push({
      [`SiteIconsIcon_${idx}`]: icon || fallbackItem.icon,
      [`SiteIconsColor_${idx}`]: color || fallbackItem.color,
      [`SiteIconsTitle_${idx}`]: title || fallbackItem.title,
      [`SiteIconsDescription_${idx}`]: description || fallbackItem.description,
    });
  }
  return result;
};

const TrustBadgesSection: React.FC<TrustBadgesSectionProps> = ({ initialBadges }) => {
  const [badges, setBadges] = useState<any[]>(() => mapApiToBadges(initialBadges));

  // Sync state if initialBadges changes
  useEffect(() => {
    setBadges(mapApiToBadges(initialBadges));
  }, [initialBadges]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        const match = objectId.match(/^(SiteIconsIcon|SiteIconsColor|SiteIconsTitle|SiteIconsDescription)_(\d+)$/);
        if (match) {
          const fieldName = match[1];
          const index = parseInt(match[2], 10);

          setBadges((prevBadges) => {
            const newBadges = [...prevBadges];
            if (newBadges[index]) {
              newBadges[index] = {
                ...newBadges[index],
                [`${fieldName}_${index}`]: value,
              };
            }
            return newBadges;
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="py-10 md:py-14 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item, idx) => {
            const iconName = item[`SiteIconsIcon_${idx}`] || "Truck";
            const color = item[`SiteIconsColor_${idx}`] || "";
            const title = item[`SiteIconsTitle_${idx}`] || "";
            const description = item[`SiteIconsDescription_${idx}`] || "";

            const IconComponent = getIconComponent(iconName);
            const { bgClass, textClass, inlineStyle } = getBadgeStyles(color);

            return (
              <div
                key={idx}
                className="group flex items-start gap-4 p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Hidden tags to map properties for ThemePreviewProvider/Dashboard discovery if needed */}
                <span id={`SiteIconsIcon_${idx}`} data-id={`SiteIconsIcon_${idx}`} className="hidden" />
                <span id={`SiteIconsColor_${idx}`} data-id={`SiteIconsColor_${idx}`} className="hidden" />

                <div
                  className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${bgClass}`}
                  style={inlineStyle.container}
                >
                  <IconComponent
                    className={`w-6 h-6 ${textClass}`}
                    style={inlineStyle.text}
                  />
                </div>
                <div>
                  <h3
                    id={`SiteIconsTitle_${idx}`}
                    data-id={`SiteIconsTitle_${idx}`}
                    className="font-semibold text-gray-900 text-sm mb-1"
                  >
                    {title}
                  </h3>
                  <p
                    id={`SiteIconsDescription_${idx}`}
                    data-id={`SiteIconsDescription_${idx}`}
                    className="text-xs text-gray-500 leading-relaxed"
                  >
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadgesSection;
