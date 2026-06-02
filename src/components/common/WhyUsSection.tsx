"use client";

import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
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
import { fallbackWhyUsData, WhyUsData } from "@/data/WhyUsSection";

interface WhyUsSectionProps {
  initialData?: WhyUsData | null;
}

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
};

const getIconComponent = (iconName: string) => {
  const name = iconName ? iconName.trim() : "";

  if (name === "Truck") {
    return Truck;
  } else if (name === "Shield") {
    return Shield;
  } else if (name === "Headphones") {
    return Headphones;
  } else if (name === "RotateCcw") {
    return RotateCcw;
  } else if (name === "ShoppingCart") {
    return ShoppingCart;
  } else if (name === "ShoppingBag") {
    return ShoppingBag;
  } else if (name === "Receipt") {
    return Receipt;
  } else if (name === "CreditCard") {
    return CreditCard;
  } else {
    // Safe check for case-insensitive matches
    const lower = name.toLowerCase();
    if (lower === "truck") {
      return Truck;
    } else if (lower === "shield") {
      return Shield;
    } else if (lower === "headphones") {
      return Headphones;
    } else if (lower === "rotateccw" || lower === "rotate-ccw") {
      return RotateCcw;
    } else if (lower === "shoppingcart" || lower === "shopping-cart") {
      return ShoppingCart;
    } else if (lower === "shoppingbag" || lower === "shopping-bag") {
      return ShoppingBag;
    } else if (lower === "receipt") {
      return Receipt;
    } else if (lower === "creditcard" || lower === "credit-card") {
      return CreditCard;
    }
    return Shield; // Fallback
  }
};

const getTagStyles = (color: string) => {
  if (!color) {
    return {
      bgClass: "bg-violet-50 text-violet-600 border-violet-100",
      inlineStyle: {},
    };
  }

  const normalized = color.toLowerCase().trim();
  if (colorMap[normalized]) {
    const matched = colorMap[normalized];
    return {
      bgClass: `${matched.bg} ${matched.text} ${matched.border}`,
      inlineStyle: {},
    };
  }

  // Hex color
  return {
    bgClass: "",
    inlineStyle: {
      backgroundColor: color.startsWith("#") ? `${color}15` : color,
      color: color,
      borderColor: color.startsWith("#") ? `${color}30` : color,
    },
  };
};

const getItemStyles = (color: string) => {
  if (!color) {
    return {
      bgClass: "from-white to-blue-50/20 border-blue-100",
      iconContainerStyle: {
        backgroundColor: "rgba(24, 144, 255, 0.1)",
        color: "#1890ff",
      },
      inlineStyle: {},
    };
  }

  const normalized = color.toLowerCase().trim();
  if (colorMap[normalized]) {
    const item = colorMap[normalized];
    return {
      bgClass: `from-white to-${normalized}-50/20 ${item.border}`,
      iconContainerStyle: {},
      inlineStyle: {
        iconContainer: {
          backgroundColor: normalized === "blue" ? "rgba(24, 144, 255, 0.1)" : `${item.text.replace("text-", "")}15`,
          color: normalized === "blue" ? "#1890ff" : "",
        },
      },
    };
  }

  // Custom hex color code
  return {
    bgClass: "border-gray-100",
    iconContainerStyle: {
      backgroundColor: color.startsWith("#") ? `${color}15` : color,
      color: color,
    },
    inlineStyle: {
      card: {
        background: `linear-gradient(to bottom right, #ffffff, ${color.startsWith("#") ? `${color}05` : color})`,
        borderColor: color.startsWith("#") ? `${color}20` : color,
      },
    },
  };
};

const mapApiToWhyUs = (apiData: any): WhyUsData => {
  if (!apiData) return fallbackWhyUsData;

  const resultList: any[] = [];
  const apiList = apiData.WhyUsList || [];

  for (let idx = 0; idx < 4; idx++) {
    let bg = "";
    let icon = "";
    let title = "";
    let desc = "";

    if (Array.isArray(apiList)) {
      for (const obj of apiList) {
        if (obj[`WhyUsCartBgColor_${idx}`] !== undefined && !bg) {
          bg = obj[`WhyUsCartBgColor_${idx}`];
        }
        if (obj[`WhyUsCartIcon_${idx}`] !== undefined && !icon) {
          icon = obj[`WhyUsCartIcon_${idx}`];
        }
        if (obj[`WhyUsCartTitle_${idx}`] !== undefined && !title) {
          title = obj[`WhyUsCartTitle_${idx}`];
        }
        if (obj[`WhyUsCartDescription_${idx}`] !== undefined && !desc) {
          desc = obj[`WhyUsCartDescription_${idx}`];
        }
      }
    }

    const fallbackItem = fallbackWhyUsData.WhyUsList[idx] || fallbackWhyUsData.WhyUsList[0];

    resultList.push({
      [`WhyUsCartBgColor_${idx}`]: bg || fallbackItem[`WhyUsCartBgColor_${idx}`],
      [`WhyUsCartIcon_${idx}`]: icon || fallbackItem[`WhyUsCartIcon_${idx}`],
      [`WhyUsCartTitle_${idx}`]: title || fallbackItem[`WhyUsCartTitle_${idx}`],
      [`WhyUsCartDescription_${idx}`]: desc || fallbackItem[`WhyUsCartDescription_${idx}`],
    });
  }

  return {
    WhyUsTagName: apiData.WhyUsTagName || fallbackWhyUsData.WhyUsTagName,
    WhyUsTagColor: apiData.WhyUsTagColor || fallbackWhyUsData.WhyUsTagColor,
    WhyUsTittle: apiData.WhyUsTittle || fallbackWhyUsData.WhyUsTittle,
    WhyUsList: resultList,
  };
};

const WhyUsSection: React.FC<WhyUsSectionProps> = ({ initialData }) => {
  const [whyUsData, setWhyUsData] = useState<WhyUsData>(() => mapApiToWhyUs(initialData));

  // Keep state updated if initialData changes
  useEffect(() => {
    setWhyUsData(mapApiToWhyUs(initialData));
  }, [initialData]);

  // Real-time preview updates listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THEME_UPDATE") {
        const { objectId, value } = event.data;
        if (!objectId) return;

        if (objectId === "WhyUsTagName") {
          setWhyUsData((prev) => ({ ...prev, WhyUsTagName: value }));
        } else if (objectId === "WhyUsTagColor") {
          setWhyUsData((prev) => ({ ...prev, WhyUsTagColor: value }));
        } else if (objectId === "WhyUsTittle") {
          setWhyUsData((prev) => ({ ...prev, WhyUsTittle: value }));
        } else {
          const match = objectId.match(/^(WhyUsCartBgColor|WhyUsCartIcon|WhyUsCartTitle|WhyUsCartDescription)_(\d+)$/);
          if (match) {
            const fieldName = match[1];
            const index = parseInt(match[2], 10);

            setWhyUsData((prev) => {
              const newList = [...prev.WhyUsList];
              if (newList[index]) {
                newList[index] = {
                  ...newList[index],
                  [`${fieldName}_${index}`]: value,
                };
              }
              return {
                ...prev,
                WhyUsList: newList,
              };
            });
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const tagStyles = getTagStyles(whyUsData.WhyUsTagColor);

  return (
    <section className="py-14 md:py-20 bg-white">
      {/* Hidden tags to map properties for ThemePreviewProvider/Dashboard discovery if needed */}
      <span id="WhyUsTagColor" data-id="WhyUsTagColor" className="hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span
            id="WhyUsTagName"
            data-id="WhyUsTagName"
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full mb-3 border ${tagStyles.bgClass}`}
            style={tagStyles.inlineStyle}
          >
            <Star className="w-3.5 h-3.5" />
            {whyUsData.WhyUsTagName}
          </span>
          <h2
            id="WhyUsTittle"
            data-id="WhyUsTittle"
            className="text-2xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            {whyUsData.WhyUsTittle}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {whyUsData.WhyUsList.map((item, idx) => {
            const bgColor = item[`WhyUsCartBgColor_${idx}`] || "";
            const iconName = item[`WhyUsCartIcon_${idx}`] || "";
            const title = item[`WhyUsCartTitle_${idx}`] || "";
            const description = item[`WhyUsCartDescription_${idx}`] || "";

            const IconComponent = getIconComponent(iconName);
            const { bgClass, iconContainerStyle, inlineStyle } = getItemStyles(bgColor);

            return (
              <div
                key={idx}
                className={`group relative rounded-2xl bg-gradient-to-br border p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${bgClass}`}
                style={inlineStyle.card}
              >
                {/* Hidden mapping tags for discovery */}
                <span id={`WhyUsCartBgColor_${idx}`} data-id={`WhyUsCartBgColor_${idx}`} className="hidden" />
                <span id={`WhyUsCartIcon_${idx}`} data-id={`WhyUsCartIcon_${idx}`} className="hidden" />

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                  style={iconContainerStyle}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3
                  id={`WhyUsCartTitle_${idx}`}
                  data-id={`WhyUsCartTitle_${idx}`}
                  className="text-lg font-bold text-gray-900 mb-2"
                >
                  {title}
                </h3>
                <p
                  id={`WhyUsCartDescription_${idx}`}
                  data-id={`WhyUsCartDescription_${idx}`}
                  className="text-sm text-gray-500 leading-relaxed"
                >
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
