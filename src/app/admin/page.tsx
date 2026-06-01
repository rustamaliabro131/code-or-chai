"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";
import { Package, ShoppingBag, Users, DollarSign, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Customers</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "orders"
              ? "bg-primary text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "products"
              ? "bg-primary text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          Products
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-6 py-4">
                      {order.user ? (
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-slate-500">{order.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">Guest</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/orders`}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No orders yet
            </div>
          )}
        </div>
      )}

      {/* Products Table */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-end">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-slate-500 line-clamp-1 max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`${
                        product.stock > 10 ? "text-green-600" : 
                        product.stock > 0 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}