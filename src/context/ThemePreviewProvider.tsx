'use client';

import { useEffect } from 'react';

export default function ThemePreviewProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handlePreviewMessage = (event: MessageEvent) => {
            // Dashboard'dan gelen 'THEME_UPDATE' mesajlarını yakala
            if (event.data?.type === 'THEME_UPDATE') {
                const { objectId, value } = event.data;

                if (!objectId) return;

                // Dashboard tarafındaki objectId ile ID'si eşleşen elementi bul
                const element = document.getElementById(objectId);

                if (element) {
                    // 1. Eğer element bir HTML img etiketi ise
                    if (element instanceof HTMLImageElement) {
                        // Next.js (veya browser) responsive resim mekanizmasını (srcset) devre dışı bırak
                        element.srcset = "";
                        // Yeni resmi (Base64 veya URL) ata
                        element.src = value;
                    } 
                    // 2. Eğer element standart bir yazı alanı ise
                    else {
                        element.innerText = value;
                    }
                }
            }
        };

        window.addEventListener('message', handlePreviewMessage);
        return () => window.removeEventListener('message', handlePreviewMessage);
    }, []);

    return <>{children}</>;
}

