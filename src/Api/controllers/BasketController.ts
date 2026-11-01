import axios from "axios";

export interface BasketCalculationRequest {
  products: {
    productId: string;
    productFeaturesOptionsKey: string[];
    piece: number;
  }[];
  couponCode: string | null;
}

export interface BasketCalculationItem {
  productId: string;
  title: string;
  piece: number;
  productFeaturesOptionsKey: string[];
  vatRate: number;
  originalTotal: number;
  productDiscountPercentage: number;
  productDiscountAmount: number;
  subtotal: number;
  couponDiscountAmount: number;
  payableTotal: number;
}

export interface BasketCalculationResponse {
  vatIncluded: boolean;
  originalTotal: number;
  productDiscountTotal: number;
  subtotal: number;
  couponDiscountTotal: number;
  totalDiscount: number;
  payableTotal: number;
  coupon: {
    code: string;
    type: string;
    value: number;
    discountAmount: number;
  } | null;
  items: BasketCalculationItem[];
}

export const calculateBasketApi = (request: BasketCalculationRequest) =>
  axios.post<BasketCalculationResponse>("/products/basket/calculate", request);
