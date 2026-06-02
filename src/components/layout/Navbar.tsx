"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";;
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import SearchDropdown from "../SearchDropdown";
import {
  ShoppingCart,
  Heart,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { getFileUrl } from "@/utils/file";
import { LogoAndNameData } from "@/types";
import logo from "@/assets/logo.png";

interface NavbarProps {
  logoAndNameData?: LogoAndNameData;
}

const Navbar: React.FC<NavbarProps> = ({ logoAndNameData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { favoriteCount } = useFavorites();
  const navigate = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getUserInitial = () => {
    if (!user) return "U";
    const name = user.firstName || user.email || "U";
    return name && name[0] ? String(name[0]).toUpperCase() : "U";
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate.push("/");
  };

  const displayLogo = logoAndNameData?.Logo || logo.src;
  const siteName = logoAndNameData?.SiteNamePrimaryTitle || "Zmrelektronik";

  const splitSiteName = (title: string): { black: string; primary: string } => {
    if (!title) return { black: "Zmr", primary: "elektronik" };
    const spaceIndex = title.indexOf(" ");
    if (spaceIndex !== -1) {
      return {
        black: title.substring(0, spaceIndex),
        primary: title.substring(spaceIndex + 1)
      };
    }
    const lowerTitle = title.toLowerCase();
    const idx = lowerTitle.indexOf("elektronik");
    if (idx !== -1) {
      return {
        black: title.substring(0, idx),
        primary: title.substring(idx)
      };
    }
    const idx2 = lowerTitle.indexOf("elektronx");
    if (idx2 !== -1) {
      return {
        black: title.substring(0, idx2),
        primary: title.substring(idx2)
      };
    }
    if (lowerTitle.startsWith("zmr") && title.length > 3) {
      return {
        black: title.substring(0, 3),
        primary: title.substring(3)
      };
    }
    return {
      black: title,
      primary: ""
    };
  };

  const { black: displaySiteNameBlack, primary: displaySiteNamePrimary } = splitSiteName(siteName);

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src={displayLogo} 
                id="Logo" 
                data-id="Logo"
                alt={`${displaySiteNameBlack} ${displaySiteNamePrimary} Logo`} 
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="text-xl font-black text-gray-900 tracking-tight">
                <span id="SiteNameBlackTitle" data-id="SiteNameBlackTitle">{displaySiteNameBlack}</span>
                <span id="SiteNamePrimaryTitle" data-id="SiteNamePrimaryTitle" className="text-cyan-600">{displaySiteNamePrimary}</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchDropdown />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/products"
              className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Ürünler
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              İletişim
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            {/* Favorites */}
            <button
              onClick={() => navigate.push("/dashboard?tab=favorites")}
              className="relative text-gray-500 hover:text-cyan-600 p-2 rounded-lg transition-colors duration-200"
              title="Favorilerim"
            >
              <Heart className="w-5 h-5" />
              {mounted && favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-500 hover:text-cyan-600 p-2 rounded-lg transition-colors duration-200"
              title="Sepetim"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && user ? (
              <div className="relative ml-2">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 rounded-lg px-2 py-1.5 transition-colors focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={getFileUrl(user.avatar)}
                      alt={user.firstName}
                      className="w-7 h-7 rounded-lg ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {getUserInitial()}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden lg:block">
                    {user.firstName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 py-1.5 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Admin Paneli
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
              >
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/cart"
              className="relative text-gray-500 hover:text-cyan-600 p-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-4 pt-3 pb-4 space-y-1 bg-white border-t border-gray-100">
            <div className="pb-3">
              <SearchDropdown onClose={() => setIsMenuOpen(false)} />
            </div>

            <Link
              href="/products"
              className="block text-gray-600 hover:text-cyan-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Ürünler
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 hover:text-cyan-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:text-cyan-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              İletişim
            </Link>

            <div className="border-t border-gray-100 my-2" />

            <button
              onClick={() => {
                navigate.push("/dashboard?tab=favorites");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between w-full text-gray-600 hover:text-cyan-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorilerim
              </span>
              {mounted && favoriteCount > 0 && (
                <span className="bg-cyan-50 text-cyan-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <>
                <div className="border-t border-gray-100 my-2" />
                <div className="flex items-center gap-3 px-4 py-3">
                  {user.avatar ? (
                    <img
                      src={getFileUrl(user.avatar)}
                      alt={user.firstName + " " + user.lastName}
                      className="w-9 h-9 rounded-lg"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                      {getUserInitial()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="block text-gray-600 hover:text-cyan-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block text-gray-600 hover:text-cyan-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Paneli
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all mx-2 mt-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
