"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/components/Providers";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary hover:underline">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/products" className="inline-flex items-center text-slate-600 hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-slate-500">Stock:</span>
            <span className={`font-medium ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-slate-500">Quantity:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-slate-300 rounded-l-lg hover:bg-slate-100 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-y border-slate-300 py-2"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border border-slate-300 rounded-r-lg hover:bg-slate-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  added 
                    ? "bg-green-600 text-white" 
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </>
          )}

          <div className="mt-8 pt-8 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Free shipping over $50
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                30-day easy returns
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Secure checkout
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                24/7 customer support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}