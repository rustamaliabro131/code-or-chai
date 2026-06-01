import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { initDb, getProducts } from "@/lib/db";
import { Package, Shield, Truck, CreditCard } from "lucide-react";

export default function Home() {
  initDb();
  const products = getProducts() as any[];
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Discover Premium Products
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                Shop the latest electronics, fashion, home goods and more at unbeatable prices.
              </p>
              <Link href="/products" className="bg-white text-primary hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
                Shop Now
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl" />
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
                  alt="Shopping"
                  width={600}
                  height={400}
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-slate-500">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-slate-500">100% protected</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-slate-500">30-day guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-sm text-slate-500">Guaranteed savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary hover:text-primary-dark font-medium">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", count: products.filter(p => p.category === "Electronics").length },
              { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", count: products.filter(p => p.category === "Fashion").length },
              { name: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", count: products.filter(p => p.category === "Home").length },
              { name: "Sports", image: "https://images.unsplash.com/photo-1461896836934- voices718d?w=400", count: products.filter(p => p.category === "Sports").length },
            ].map((category) => (
              <Link 
                key={category.name}
                href={`/products?category=${category.name}`}
                className="relative h-64 rounded-xl overflow-hidden group"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for exclusive deals and new arrivals.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-accent hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}