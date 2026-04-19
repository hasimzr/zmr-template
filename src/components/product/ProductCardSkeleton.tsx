import React from "react";

// Skeleton card mimics ProductCard layout with pulse & optional shimmer
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      {/* Image area */}
      <div className="relative flex justify-center items-center overflow-hidden aspect-square bg-gray-100">
        <div className="w-1/2 h-1/2 bg-gray-200 rounded-md" />
      </div>
      <div className="p-5">
        {/* Title placeholder */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        {/* Category pills placeholder */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-20" />
        </div>
        {/* Rating placeholder */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>
        {/* Price & button placeholder */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded-lg w-10" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
