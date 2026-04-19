"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { Category, SmallProduct } from "../../types";
import { hasDiscount } from "@/utils/product";
import { useCart } from "@/context/CartContext";
import QuickAddToCartModal from "../QuickAddToCartModal";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: SmallProduct;
  categories?: Category[];
}

const ProductCard = ({ product, categories = [] }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (
      (product as any).features &&
      Array.isArray((product as any).features) &&
      (product as any).features.length > 0
    ) {
      setIsModalOpen(true);
    } else {
      addToCart(product);
      toast.success(`${product.title} sepete eklendi!`);
    }
  };

  const idToCategory = (id: string, subId: string) => {
    const category = categories.find((cat: Category) => cat.id === Number(id));
    if (subId != "null" && category) {
      const subCategory = category?.subCategories?.find(
        (sub) => sub.id === Number(subId)
      );
      return subCategory
        ? subCategory.categoryName + " / " + category.categoryName
        : "Unknown";
    }
    return category ? category.categoryName : "Unknown";
  };

  const isDiscounted = hasDiscount(product);
  const originalPrice = product.price;
  const discountedPrice = isDiscounted ? product.price * product.discountMultiplier! : product.price;

  return (
    <>
      <Link
        href={`/product/${product.productUrl}`}
        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        {/* Product Image */}
        <div className="relative flex justify-center items-center overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.img[0]}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
          />
          {product.stock < 10 && product.stockType === "limited" && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              Son {product.stock} ürün!
            </div>
          )}
          {isDiscounted && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              %{Math.round((1 - product.discountMultiplier!) * 100)}
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Product Title */}
          <h3 className="font-semibold text-md text-gray-900 mb-3 line-clamp-2 group-hover:text-cyan-600 transition-colors duration-200 min-h-10">
            {product.title}
          </h3>

          {/* Category badges */}
          {product.category && Array.isArray(product.category) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {product.category.map((catId: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100"
                >
                  {idToCategory(catId.split(":")[0], catId.split(":")[1])}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-colors ${i < Math.floor(product.point || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              {isDiscounted ? (
                <div className="flex flex-col">
                  <del className="text-sm text-gray-400 font-normal">₺{originalPrice.toLocaleString("tr-TR")}</del>
                  <p className="text-xl font-bold text-red-600">₺{discountedPrice.toLocaleString("tr-TR")}</p>
                </div>
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  ₺{originalPrice.toLocaleString("tr-TR")}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-2.5 rounded-xl hover:from-cyan-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transform hover:scale-110"
              title="Sepete Ekle"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
      {/* Quick Add Modal */}
      <QuickAddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
