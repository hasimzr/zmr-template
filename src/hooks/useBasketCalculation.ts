"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  calculateBasketApi,
  type BasketCalculationRequest,
  type BasketCalculationResponse,
} from "@/Api/controllers/BasketController";
import type { CartItem } from "@/types";

export const buildBasketCalculationRequest = (
  items: CartItem[],
  couponCode: string | null = null,
): BasketCalculationRequest => ({
  products: items.map(({ product, selectedOptions, quantity }) => ({
    productId: product.id,
    productFeaturesOptionsKey: Object.entries(selectedOptions ?? {}).map(
      ([featureKey, selectedValue]) => {
        const features = Array.isArray(product.features) ? product.features : [];
        const feature = features.find(
          (entry: { id?: string; title?: string }) =>
            String(entry.id || entry.title) === featureKey,
        );
        const option = feature?.options?.find(
          (entry: { optionKey?: string; id?: string }) =>
            String(entry.optionKey ?? entry.id) === selectedValue ||
            String(entry.id) === selectedValue,
        );
        return String(option?.optionKey ?? selectedValue);
      },
    ),
    piece: quantity,
  })),
  couponCode: couponCode?.trim().toUpperCase() || null,
});

export const useBasketCalculation = (items: CartItem[], couponCode = "") => {
  const [settledCouponCode, setSettledCouponCode] = useState(couponCode);
  const waitingForCoupon = couponCode !== settledCouponCode;
  const requestKey = JSON.stringify(buildBasketCalculationRequest(items, settledCouponCode));
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    attempt: number;
    data: BasketCalculationResponse | null;
    error: string | null;
  } | null>(null);

  useEffect(() => {
    if (couponCode === settledCouponCode) return;
    const timer = window.setTimeout(() => setSettledCouponCode(couponCode), 1_000);
    return () => window.clearTimeout(timer);
  }, [couponCode, settledCouponCode]);

  useEffect(() => {
    const request: BasketCalculationRequest = JSON.parse(requestKey);
    if (request.products.length === 0) return;
    let active = true;

    calculateBasketApi(request)
    .then(({ data }) => {
      if (active) setResult({ key: requestKey, attempt, data, error: null });
    })
    .catch((error: unknown) => {
      if (active) {
        setResult({
          key: requestKey,
          attempt,
          data: null,
          error: isAxiosError<{ message?: string }>(error) && error.response?.data?.message
            ? error.response.data.message
            : "Sepet tutarı hesaplanamadı. Lütfen tekrar deneyin.",
        });
      }
    });

    return () => {
      active = false;
    };
  }, [requestKey, attempt]);

  const current = !waitingForCoupon && result?.key === requestKey && result.attempt === attempt
    ? result
    : null;

  return {
    calculation: current?.data ?? null,
    error: current?.error ?? null,
    loading: items.length > 0 && current === null,
    waitingForCoupon,
    retry: () => setAttempt((value) => value + 1),
  };
};
