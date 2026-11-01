# Kupon kodu entegrasyonu

Bu doküman, ElektronX temasındaki kupon özelliğini başka bir React/Next.js temasına taşımak içindir. Kullanıcı kupon kodunu yazınca metin büyük harfe çevrilir. Son değişiklikten **1 saniye** sonra backend sepeti yeniden hesaplar. Geçerli kuponun görünen kodu ödeme/sipariş isteğine de eklenir.

## 1. Bu temada hangi dosyalar kullanılıyor?

| Dosya | Görevi |
| --- | --- |
| [BasketController.ts](../src/Api/controllers/BasketController.ts) | Hesaplama isteği, yanıt tipleri ve API çağrısı |
| [useBasketCalculation.ts](../src/hooks/useBasketCalculation.ts) | Sepeti DTO'ya dönüştürme, 1 saniye bekleme, sonuç ve hata yönetimi |
| [CartClientContent.tsx](../src/app/cart/CartClientContent.tsx) | Kupon input'u, fiyat gösterimi, ödeme/sipariş payload'ları |
| [OrderController.ts](../src/Api/controllers/OrderController.ts) | Sipariş ve ödeme endpoint'leri |
| [ApiProvider.tsx](../src/Api/ApiProvider.tsx) | Ortak Axios ayarları, kimlik doğrulama ve site başlıkları |

Sipariş özetinin fiyatlarını gösteren bölüm `CartClientContent.tsx` içindedir. `SummaryOrder.tsx` son onay adımını gösterir; siparişi oluşturma işlevini üst bileşenden alır.

Başka temaya taşırken API dosyasını ve hook'u kopyalayabilirsin. Hook içindeki `CartItem` tipi ve ürün/seçenek alanlarını hedef temanın sepet yapısına uyarlaman gerekir. Hedef temada `@/` alias'ı yoksa import yollarını da değiştir.

## 2. Backend sözleşmesi

### Fiyat hesaplama

```http
POST /products/basket/calculate
Content-Type: application/json
```

`/products`, backend controller'ının sınıf seviyesindeki yoludur. Axios `baseURL` ayarına ayrıca API kök yolu eklenir; örneğin `/api/v1`. Böylece tam API yolu `/api/v1/products/basket/calculate` olur.

Örnek istek (`productId` ve seçenek anahtarları temsilidir):

```json
{
  "products": [
    {
      "productId": "API_DEN_GELEN_URUN_ID",
      "productFeaturesOptionsKey": ["red-key", "large-key"],
      "piece": 2
    }
  ],
  "couponCode": "BAHAR10"
}
```

- `productId`: Ürün API'sinden gelen mevcut ID; bu entegrasyon ID'ye ek bir dönüşüm uygulamaz.
- `productFeaturesOptionsKey`: Seçilen varyantların `optionKey` değerleri. Seçenek yoksa `[]` gönderilir.
- `piece`: Sepetteki ürün adedi. Bu temanın `quantity` alanı burada `piece` olarak eşlenir.
- `couponCode`: Kuponun görünen kodu. **Kupon ID'si veya Base64 kodlanmış kupon değeri gönderilmez.** Kuponsuz hesaplamada mevcut uygulama `null` gönderir.

| Yanıt alanı | Anlamı / kullanımı |
| --- | --- |
| `originalTotal` | Ürün indirimlerinden önceki toplam |
| `productDiscountTotal` | Ürün indirimlerinin toplamı |
| `subtotal` | Ürün indirimleri sonrası, kupon indirimi öncesi ara toplam |
| `coupon` | Uygulanan kupon bilgisi; kuponsuz yanıtta `null` |
| `coupon.code` | Ödeme/sipariş isteğine aktarılacak görünen kupon kodu |
| `couponDiscountTotal` | Kupondan kaynaklanan indirim |
| `totalDiscount` | Ürün ve kupon indirimleri toplamı |
| `payableTotal` | Kupon indirimi sonrası ödenecek sepet tutarı |
| `vatIncluded` | Tutarların KDV içerip içermediği |
| `items` | Ürün satırı bazında tutarlar ve indirimler |

Backend açıklamasına göre hesaplama tutarları KDV ve seçilen seçeneklerin fiyat farklarını içerir; teslimat ve ödeme ücretlerini içermez. Hedef temada bu ücretler varsa ayrıca ele alınmalıdır. Bu temanın mevcut özetinde kargo “Ücretsiz” gösterilir.

## 3. API katmanını ekle

Aşağıdaki dosya mevcut uygulamadaki tipler ve çağrıdır:

```ts
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
```

Bu çağrı mevcut ortak Axios instance ayarlarını kullanır. Hedef temada `baseURL`, siteyi belirleyen başlıklar ve oturum bilgileri hazır olmalıdır. Farklı bir HTTP istemcisi kullanılıyorsa aynı gövdeyi o istemciyle gönder.

## 4. Sepet eşleme ve hesaplama hook'u

Aşağıdaki hook mevcut uygulamanın aktarılabilir halidir:

```ts
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
```

### Seçenek eşlemesi neden var?

Bu temada seçimler `{ featureId: optionIdVeyaOptionKey }` biçiminde tutulabilir. `Object.values(selectedOptions)` doğrudan kullanılırsa bazı ürünlerde `optionKey` yerine seçenek ID'si gönderilebilir. `buildBasketCalculationRequest`, ürün özelliklerinden seçeneği bulup `optionKey` değerine dönüştürür. Hedef tema zaten `optionKey[]` tutuyorsa bu eşlemeyi kendi veri yapısına göre sadeleştirebilirsin.

### 1 saniyelik bekleme nasıl çalışıyor?

1. `couponCode`, input'ta görünen anlık metindir.
2. `settledCouponCode`, son bekleme süresi tamamlanan metindir.
3. Her metin değişikliğinde `setTimeout(..., 1_000)` başlar. Yeni değişiklik önceki zamanlayıcıyı temizler.
4. Kullanıcı 1 saniye yazmazsa `settledCouponCode` güncellenir.
5. Hesaplama isteğinin anahtarı değişir ve API çağrısı yapılır.

`useEffect` bağımlılığı tuşa basılması değil input değerinin değişmesidir. Yapıştırma, silme ve “Kaldır” işlemleri de aynı beklemeye tabidir. İmleç hareketi gibi metni değiştirmeyen tuşlar süreyi sıfırlamaz.

İlk sepet hesabı, adet/ürün değişiklikleri ve hata sonrası tekrar deneme ayrıca 1 saniye bekletilmez. Kullanıcı kupon yazarken adet değişirse son bekleme süresi tamamlanan kuponla hesaplama yapılabilir; yeni kupon beklenirken sonuç ekranda geçerli kabul edilmez. Süre dolunca yeni kodla tekrar hesaplanır.

### Eski sonuçların kullanılmasını nasıl engelliyoruz?

- Her istek için ürünler ve kupondan üretilen `requestKey` tutulur.
- Yeni istek gerektiğinde önceki effect'in `active` değeri `false` olur. Geç dönen eski yanıt state'i güncelleyemez.
- Sonucun anahtarı güncel istekle eşleşmiyorsa veya kupon beklemedeyse `calculation` değeri `null` olur.
- `attempt`, aynı isteği hata sonrasında tekrar çalıştırmak içindir.

Bu yöntem eski yanıtları yok sayar; gönderilmiş HTTP isteğini fiziksel olarak iptal etmez. Boş sepet için hesaplama isteği atılmaz.

## 5. Sepet sayfasına input'u bağla

Kupon state'ini ödeme adımları boyunca yaşayan ortak bileşende tut. Bu temada bunun yeri `CartClientContent` bileşenidir:

```tsx
const [couponCode, setCouponCode] = useState("");

const {
  calculation,
  loading: calculationLoading,
  waitingForCoupon,
  error: calculationError,
  retry: retryCalculation,
} = useBasketCalculation(cartItems, couponCode);
```

Sipariş özetine eklenebilecek sade JSX:

```tsx
<label htmlFor="coupon-code">Kupon Kodu</label>
<input
  id="coupon-code"
  type="text"
  value={couponCode}
  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
  placeholder="Kupon kodunuzu girin"
  autoCapitalize="characters"
  autoComplete="off"
  spellCheck={false}
  aria-describedby="coupon-status"
  aria-invalid={Boolean(couponCode.trim() && calculationError)}
/>
{couponCode && (
  <button type="button" onClick={() => setCouponCode("")}>
    Kaldır
  </button>
)}
<p id="coupon-status" role="status">
  {waitingForCoupon
    ? "Yazmayı bıraktıktan 1 saniye sonra fiyat güncellenecek."
    : calculationLoading
      ? "Fiyat hesaplanıyor…"
      : calculation?.coupon
        ? `${calculation.coupon.code} kuponu uygulandı.`
        : "Kupon kodunuzu girebilirsiniz."}
</p>
{calculationError && (
  <div role="alert">
    <p>{calculationError}</p>
    <button type="button" onClick={retryCalculation}>Tekrar Dene</button>
  </div>
)}
```

`autoCapitalize` mobil klavyeye ipucu verir. Büyük harfe dönüşümü asıl sağlayan `toUpperCase()` çağrısıdır. İstek oluşturulurken ayrıca baştaki/sondaki boşluklar temizlenir ve boş kod `null` olur.

Kupon bu temada React state'inde tutulur; sayfa tamamen yenilendiğinde kalıcı olarak geri yüklenmez. Hedef temada ödeme adımları farklı sayfalara ayrılmışsa kuponu ortak context/store üzerinden koru ve ödeme öncesi sepeti yeniden doğrula.

## 6. Fiyatları backend yanıtından göster

```tsx
const formatAmount = (amount: number | undefined) =>
  amount == null
    ? calculationLoading ? "Hesaplanıyor…" : "—"
    : amount.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
```

| Ekran | Kullanılacak değer |
| --- | --- |
| Ara toplam | `formatAmount(calculation?.subtotal)` |
| Kupon indirimi | `formatAmount(calculation?.couponDiscountTotal)` |
| Ödenecek toplam | `formatAmount(calculation?.payableTotal)` |
| Mobil sabit toplam | `formatAmount(calculation?.payableTotal)` |
| Havale bilgilendirmesindeki toplam | `formatAmount(calculation?.payableTotal)` |

Kupon indirimi satırını `calculation && calculation.couponDiscountTotal > 0` koşuluyla göster. KDV bilgisini `calculation?.vatIncluded` üzerinden göster.

Ödeme toplamını yerel `cartTotal` hesabından üretme ve backend hatasında eski yerel tutara dönme. Mevcut `Basket.tsx` ürün kartlarının satır fiyatları hâlâ ürün verilerinden yerel hesaplanır; bu entegrasyonun backend'e bağladığı alanlar sipariş özeti ve ödeme toplamlarıdır. Hedef temada satır bazında kupon dağılımı da gösterilecekse yanıtın `items` alanı kullanılmalıdır.

## 7. Kuponu ödeme ve sipariş isteğine ekle

Hesaplama beklenirken veya başarısızken sipariş/ödeme başlatma. Bu temada hem `handlePaymentMethodComplete` hem `handleSubmitOrder` girişinde şu kontrol bulunur:

```ts
if (!calculation) {
  toast.error(
    calculationError || "Lütfen sepet tutarının hesaplanmasını bekleyin."
  );
  return;
}
```

Adres, müşteri ve ürün alanlarıyla oluşturduğun mevcut payload'a şu alanı ekle:

```ts
const payload = {
  // Mevcut müşteri, adres, ödeme ve ürün alanları burada kalır.
  ...(calculation.coupon?.code
    ? { couponCode: calculation.coupon.code }
    : {}),
};
```

Burada input'taki henüz doğrulanmamış metin yerine **backend'in kabul ettiği `calculation.coupon.code`** kullanılır. Kupon yoksa alan gönderilmez. `couponDiscount` ve `couponReservationId` eklenmez; sunucu bunları oluşturur.

| Endpoint | Bu temadaki kullanım |
| --- | --- |
| `POST /order/add` | Havale, kapıda ödeme ve sağlayıcıya özel iyzico/PayTR akışına girmeyen kart ödemesi |
| `POST /order/iyzico/payment/initialize` | iyzico ödeme başlatma |
| `POST /order/paytr/payment/initialize` | PayTR ödeme başlatma |
| `POST /order/payment/initialize` | Bu temada kullanılmıyor; hedef tema kullanıyorsa aynı alanı buraya da ekle |

Bu temada iyzico/PayTR ödeme başlangıcı hem `handlePaymentMethodComplete` hem `handleSubmitOrder` içinde yer alır. İki payload oluşturma noktasında da kupon alanı bulunmalıdır. Sadece son sipariş isteğine eklemek, daha önce başlayan kart ödemesine kuponun ulaşmasını sağlamaz.

## 8. Hedef temada doğrulama

Network sekmesinde **Fetch/XHR** ve `calculate` filtresiyle kontrol et:

- Kuponsuz dolu sepette hesaplama isteği gidiyor; boş sepette gitmiyor.
- Küçük harfle yazılan kupon input'ta büyük harfe dönüşüyor.
- Yazı değişirken kupon kaynaklı istek gitmiyor; son değişiklikten 1 saniye sonra gidiyor.
- 1 saniye dolmadan yeni karakter yazıldığında sayaç sıfırlanıyor.
- İstek `products`, doğru `optionKey` değerleri, `piece` ve görünen `couponCode` alanını içeriyor.
- Geçerli kuponda indirim ve `payableTotal` ekranda güncelleniyor.
- Geçersiz kuponda backend mesajı gösteriliyor; ödeme başlatılmıyor.
- Kupon kaldırılınca 1 saniye sonra `couponCode: null` ile kuponsuz hesap yapılıyor.
- Ürün/adet değişikliği hesabı yeniliyor; geç dönen eski yanıt yeni fiyatı ezmiyor.
- Masaüstü, mobil ve havale toplamları aynı backend sonucunu kullanıyor.
- Kullanılan her ödeme/sipariş payload'ında kupon varsa düz metin `couponCode` bulunuyor; kupon yoksa alan bulunmuyor.
- Payload'da `couponDiscount` veya `couponReservationId` bulunmuyor.

Bu projede tip kontrolü için `npx tsc --noEmit --incremental false` kullanıldı. Sipariş/ödeme payload'ları ağ çağrısı yapmayan mock testleriyle kontrol edildi. Tarayıcıda büyük harf dönüşümü, geçersiz kupon yanıtı ve kod silinince kuponsuz fiyata dönüş doğrulandı. Geçerli kuponla indirim ve gerçek ödeme sonucunu hedef temanın test ortamında ayrıca doğrula.
