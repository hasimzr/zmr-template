"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getFavoritesCountApi } from "@/Api/controllers/ProductController";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favoriteCount: number;
  refreshFavoriteCount: () => Promise<void>;
  incrementFavoriteCount: () => void;
  decrementFavoriteCount: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteCount, setFavoriteCount] = useState(0);

  const refreshFavoriteCount = async () => {
    // Sadece giriş yapmış kullanıcılar için favori sayısını çek
    if (!isAuthenticated) {
      setFavoriteCount(0);
      return;
    }

    try {
      const response = await getFavoritesCountApi();
      setFavoriteCount(response.data || 0);
    } catch (error) {
      console.error("Favori sayısı yüklenirken hata:", error);
      setFavoriteCount(0);
    }
  };

  const incrementFavoriteCount = () => {
    setFavoriteCount((prev) => prev + 1);
  };

  const decrementFavoriteCount = () => {
    setFavoriteCount((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshFavoriteCount();
    } else {
      setFavoriteCount(0);
    }
  }, [isAuthenticated]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteCount,
        refreshFavoriteCount,
        incrementFavoriteCount,
        decrementFavoriteCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
