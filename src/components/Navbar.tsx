"use client";

import Link from "next/link";
import { useAuth } from "./Providers";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const itemCount = getItemCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold text-primary">
            ShopEase
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-slate-700 hover:text-primary transition-colors font-medium">
              Products
            </Link>
            <Link href="/products?category=Electronics" className="text-slate-700 hover:text-primary transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=Fashion" className="text-slate-700 hover:text-primary transition-colors">
              Fashion
            </Link>
            <Link href="/products?category=Home" className="text-slate-700 hover:text-primary transition-colors">
              Home
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-slate-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <User className="w-6 h-6 text-slate-700" />
                  <span className="hidden md:inline text-sm font-medium text-slate-700">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/orders" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">My Orders</Link>
                    {user.isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">Admin Dashboard</Link>
                    )}
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-slate-700 hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/products" className="text-slate-700 hover:text-primary transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link href="/products?category=Electronics" className="text-slate-700 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Electronics
              </Link>
              <Link href="/products?category=Fashion" className="text-slate-700 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Fashion
              </Link>
              <Link href="/products?category=Home" className="text-slate-700 hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link href="/login" className="text-slate-700 hover:text-primary transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}