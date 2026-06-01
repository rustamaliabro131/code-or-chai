"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/components/Providers";
import { CreditCard, Lock, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState<"shipping" | "payment" | "complete">("shipping");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const total = getTotal();
  const shipping = total >= 50 ? 0 : 5.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          total: grandTotal,
          shippingAddress: `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      clearCart();
      setStep("complete");
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "complete") {
    router.push("/cart");
    return null;
  }

  if (step === "complete") {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-slate-600 mb-8 text-lg">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/orders")}
            className="btn-primary"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="btn-secondary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-center mb-12">
        <div className={`flex items-center ${step === "shipping" || step === "payment" ? "text-primary" : "text-slate-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "shipping" ? "bg-primary text-white" : "bg-slate-200"}`}>
            1
          </div>
          <span className="ml-2 font-medium">Shipping</span>
        </div>
        <div className="w-16 h-0.5 bg-slate-300 mx-4"></div>
        <div className={`flex items-center ${step === "payment" ? "text-primary" : "text-slate-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-primary text-white" : "bg-slate-200"}`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="input"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                Continue to Payment
              </button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
              
              <div className="flex items-center gap-2 mb-6 p-4 bg-slate-50 rounded-lg">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600">Your payment information is secure and encrypted</span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="input pl-12"
                  />
                  <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                  <input
                    type="text"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ${grandTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-slate-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}