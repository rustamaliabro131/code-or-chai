"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/components/Providers";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  const total = getTotal();

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Looks like you have not added any items to your cart yet.</p>
        <Link href="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {items.map((item) => (
              <div key={item.product.id} className="p-6 border-b last:border-b-0">
                <div className="flex gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                        <p className="text-slate-500 text-sm mb-2">{item.product.category}</p>
                        <p className="font-bold text-primary">${item.product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-slate-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link 
            href="/products" 
            className="inline-flex items-center text-primary hover:text-primary-dark mt-6 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium">{total >= 50 ? "Free" : "$5.99"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ${(total + (total >= 50 ? 0 : 5.99) + total * 0.08).toFixed(2)}
                </span>
              </div>
            </div>

            {total < 50 && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-sm">
                Add ${(50 - total).toFixed(2)} more to qualify for free shipping!
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"}
              <ArrowRight className="w-5 h-5" />
            </button>

            {!user && (
              <p className="text-sm text-slate-500 text-center mt-4">
                Please login or create an account to checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}