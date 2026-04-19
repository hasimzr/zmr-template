import {
  Truck,
  Shield,
  Headphones,
  RotateCcw,
} from "lucide-react";

export interface TrustBadgesSectionItem {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
}

export const trustBadgesSectionData: TrustBadgesSectionItem[] = [
  {
    id: 1,
    icon: Truck,
    title: "Hızlı Kargo",
    description:
      "Aynı gün kargo ile siparişleriniz hızla elinize ulaşır.",
    color: "blue",
  },
  {
    id: 2,
    icon: Shield,
    title: "Güvenli Ödeme",
    description:
      "256-bit SSL şifreleme ile güvenli alışveriş deneyimi yaşayın.",
    color: "emerald",
  },
  {
    id: 3,
    icon: Headphones,
    title: "7/24 Teknik Destek",
    description:
      "Uzman ekibimiz her zaman yanınızda. Sorularınız anında cevaplanır.",
    color: "violet",
  },
  {
    id: 4,
    icon: RotateCcw,
    title: "Kolay İade",
    description:
      "14 gün içinde koşulsuz iade garantisi sunuyoruz.",
    color: "amber",
  },
];
