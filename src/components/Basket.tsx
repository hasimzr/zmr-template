import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  Package
} from "lucide-react";
import {
  calculateProductUnitPrice,
  getOriginalUnitPrice,
  hasDiscount,
  getProductMainImage,
} from "@/utils/product";
import Link from "next/link";;

const Basket = () => {
  const { cartItems, removeFromCart, updateQuantity } =
    useCart();
  const formatCurrency = (value: number) =>
    value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

  const getOptionLabels = (
    product: any,
    featureKey: string,
    optionValue: any,
  ) => {
    const feature =
      product?.features && Array.isArray(product.features)
        ? product.features.find(
          (f: any) => String(f.id || f.title) === String(featureKey),
        )
        : null;
    const option = feature?.options?.find(
      (o: any) =>
        String(o.optionKey ?? o.id) === String(optionValue) ||
        String(o.id) === String(optionValue),
    );

    return {
      featureLabel: feature?.title || feature?.name || featureKey,
      optionLabel: option?.name || optionValue,
    };
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Sepetinizde ürün bulunmamaktadır
          </p>
        </div>
      ) : (
        cartItems.map((item) => {
          const unitPrice = calculateProductUnitPrice(
            item.product,
            item.selectedOptions,
          );
          const originalUnitPrice = getOriginalUnitPrice(
            item.product,
            item.selectedOptions,
          );
          const isDiscounted = hasDiscount(item.product);
          return (
            <div
              key={item.cartKey}
              className="bg-white rounded-xl shadow-md hover:shadow-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 transition-all duration-300 border border-gray-100 hover:border-cyan-200 group"
            >
              {/* Ürün Görseli */}
              <Link
                href={`/product/${item.product.productUrl}`}
                className="w-full sm:w-28 h-28 sm:h-28 shrink-0 overflow-hidden rounded-lg bg-gray-50"
              >
                <img
                  src={getProductMainImage(item.product)}
                  alt={item.product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </Link>

              {/* Ürün Bilgileri */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link
                    href={`/product/${item.product.productUrl}`}
                    className="font-semibold text-gray-900 hover:text-cyan-600 transition line-clamp-2 text-base sm:text-lg"
                  >
                    {item.product.title}
                  </Link>
                  {item.selectedOptions &&
                    Object.keys(item.selectedOptions).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(item.selectedOptions).map(
                          ([featKey, optId]) => {
                            const { featureLabel, optionLabel } =
                              getOptionLabels(item.product, featKey, optId);
                            return (
                              <span
                                key={`${item.cartKey}-${featKey}`}
                                className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs text-cyan-700"
                                title={`${featureLabel}: ${optionLabel}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5"></span>
                                <span className="font-medium">
                                  {featureLabel}:
                                </span>
                                <span className="ml-1 text-cyan-800">
                                  {optionLabel}
                                </span>
                              </span>
                            );
                          },
                        )}
                      </div>
                    )}
                  {item.product.subcategory && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      {item.product.subcategory}
                    </p>
                  )}
                  <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                    {isDiscounted && (
                      <del className="text-sm text-gray-400 font-normal">
                        {formatCurrency(originalUnitPrice * item.quantity)}
                      </del>
                    )}
                    <p className={`text-xl sm:text-2xl font-bold ${isDiscounted ? 'text-red-600' : 'text-cyan-600'}`}>
                      {formatCurrency(unitPrice * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ({formatCurrency(unitPrice)} / adet)
                    </p>
                  </div>
                </div>

                {/* Miktar ve İşlemler */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-medium mr-1">
                      Miktar:
                    </span>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartKey, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 hover:bg-cyan-50 hover:text-cyan-600 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-12 text-center text-gray-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartKey, item.quantity + 1)
                        }
                        className="w-9 h-9 hover:bg-cyan-50 hover:text-cyan-600 transition flex items-center justify-center rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartKey)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all flex items-center gap-1.5 group/delete"
                    title="Sepetten Kaldır"
                  >
                    <Trash2 className="w-5 h-5 group-hover/delete:scale-110 transition-transform" />
                    <span className="text-xs font-medium hidden sm:inline">
                      Kaldır
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Basket;
