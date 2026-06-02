"use client";

import React, { useState, useEffect } from "react";

interface Props {
  initialData: {
    sitePrimaryColor?: string;
    siteSecconderyColor?: string;
    siteSuccessColor?: string;
    siteDangerColor?: string;
  } | null | undefined;
}

// Helper to convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Clean string
  let cleanHex = hex.replace(/^#/, '').trim();
  
  // Handlers for shorthand hex like "fff" or "000"
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  
  // If not a valid hex string, return fallback values
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return { h: 0, s: 0, l: 0 };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Generate CSS variable shades for a given color name
function generateShadesCss(name: string, hexColor: string): string {
  try {
    const { h, s, l } = hexToHsl(hexColor);
    // Returns full palette of variables from 50 to 950
    return `
      --color-${name}-50: hsl(${h}, ${s}%, ${Math.min(97, Math.max(90, l + (100 - l) * 0.9))}%) !important;
      --color-${name}-100: hsl(${h}, ${s}%, ${Math.min(95, Math.max(85, l + (100 - l) * 0.8))}%) !important;
      --color-${name}-200: hsl(${h}, ${s}%, ${Math.min(90, Math.max(75, l + (100 - l) * 0.6))}%) !important;
      --color-${name}-300: hsl(${h}, ${s}%, ${Math.min(80, Math.max(65, l + (100 - l) * 0.4))}%) !important;
      --color-${name}-400: hsl(${h}, ${s}%, ${Math.min(70, Math.max(55, l + (100 - l) * 0.2))}%) !important;
      --color-${name}-500: ${hexColor} !important;
      --color-${name}-600: hsl(${h}, ${s}%, ${Math.max(5, l * 0.85)}%) !important;
      --color-${name}-700: hsl(${h}, ${s}%, ${Math.max(5, l * 0.7)}%) !important;
      --color-${name}-800: hsl(${h}, ${s}%, ${Math.max(5, l * 0.55)}%) !important;
      --color-${name}-900: hsl(${h}, ${s}%, ${Math.max(5, l * 0.4)}%) !important;
      --color-${name}-950: hsl(${h}, ${s}%, ${Math.max(2, l * 0.25)}%) !important;
    `;
  } catch (e) {
    return "";
  }
}

export default function ThemeColorProvider({ initialData }: Props) {
  // Provide robust fallbacks for each color if missing, invalid or null
  const defaultColors = {
    sitePrimaryColor: initialData?.sitePrimaryColor || "#06b6d4",
    siteSecconderyColor: initialData?.siteSecconderyColor || "#3b82f6",
    siteSuccessColor: initialData?.siteSuccessColor || "#22c55e",
    siteDangerColor: initialData?.siteDangerColor || "#ef4444",
  };

  const [data, setData] = useState(defaultColors);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'THEME_UPDATE') {
        const { objectId, value } = event.data;
        
        setData((prevData: any) => {
          const updated = { ...prevData };
          let isListUpdated = false;
          
          // 1. LIST alanlarını kontrol et ve güncelle
          for (const key of Object.keys(updated)) {
            if (Array.isArray(updated[key])) {
              updated[key] = updated[key].map((item: any) => {
                const newItem = { ...item };
                Object.keys(newItem).forEach(fieldKey => {
                  if (fieldKey === objectId) {
                    newItem[fieldKey] = value;
                    isListUpdated = true;
                  }
                });
                return newItem;
              });
            }
          }
          
          // 2. Tekil (normal) alanları güncelle
          if (!isListUpdated) {
            if (objectId === "sitePrimaryColor") updated["sitePrimaryColor"] = value;
            if (objectId === "siteSecconderyColor") updated["siteSecconderyColor"] = value;
            if (objectId === "siteSuccessColor") updated["siteSuccessColor"] = value;
            if (objectId === "siteDangerColor") updated["siteDangerColor"] = value;
          }
          
          return updated;
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const primaryColor = data.sitePrimaryColor || "#06b6d4";
  const secondaryColor = data.siteSecconderyColor || "#3b82f6";
  const successColor = data.siteSuccessColor || "#22c55e";
  const dangerColor = data.siteDangerColor || "#ef4444";

  // Build the CSS dynamic variables style content
  const cssVariables = `
    :root {
      ${generateShadesCss("cyan", primaryColor)}
      ${generateShadesCss("blue", secondaryColor)}
      ${generateShadesCss("green", successColor)}
      ${generateShadesCss("emerald", successColor)}
      ${generateShadesCss("red", dangerColor)}
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {/* Hidden elements with data-id for admin preview support */}
      <div style={{ display: 'none' }}>
        <div data-id="sitePrimaryColor" id="sitePrimaryColor">{primaryColor}</div>
        <div data-id="siteSecconderyColor" id="siteSecconderyColor">{secondaryColor}</div>
        <div data-id="siteSuccessColor" id="siteSuccessColor">{successColor}</div>
        <div data-id="siteDangerColor" id="siteDangerColor">{dangerColor}</div>
      </div>
    </>
  );
}
