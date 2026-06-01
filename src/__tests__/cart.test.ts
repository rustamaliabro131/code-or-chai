import { useCartStore } from "@/store/cart";
import { Product } from "@/lib/types";

const createMockProduct = (id: number, name: string, price: number): Product => {
  const slug = name.toLowerCase().replace(/\s/g, "-");
  return {
    id,
    name,
    description: "Description for " + name,
    price,
    image: "https://example.com/" + slug + ".jpg",
    category: "Test",
    stock: 10,
    createdAt: new Date().toISOString(),
  };
};

describe("Cart Store", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      const product = createMockProduct(1, "Test Product", 29.99);
      const addItem = useCartStore.getState().addItem;
      
      addItem(product);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].product).toEqual(product);
      expect(items[0].quantity).toBe(1);
    });

    it("should increment quantity when adding existing product", () => {
      const product = createMockProduct(1, "Test Product", 29.99);
      const { addItem } = useCartStore.getState();
      
      addItem(product);
      addItem(product);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("should add multiple different products", () => {
      const product1 = createMockProduct(1, "Product 1", 19.99);
      const product2 = createMockProduct(2, "Product 2", 39.99);
      const { addItem } = useCartStore.getState();
      
      addItem(product1);
      addItem(product2);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", () => {
      const product = createMockProduct(1, "Test Product", 29.99);
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(product);
      removeItem(product.id);
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("should not affect other items when removing one", () => {
      const product1 = createMockProduct(1, "Product 1", 19.99);
      const product2 = createMockProduct(2, "Product 2", 39.99);
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(product1);
      addItem(product2);
      removeItem(product1.id);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe(2);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const product = createMockProduct(1, "Test Product", 29.99);
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(product);
      updateQuantity(product.id, 5);
      
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it("should remove item when quantity is set to 0 or less", () => {
      const product = createMockProduct(1, "Test Product", 29.99);
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(product);
      updateQuantity(product.id, 0);
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("should remove all items from the cart", () => {
      const product1 = createMockProduct(1, "Product 1", 19.99);
      const product2 = createMockProduct(2, "Product 2", 39.99);
      const { addItem, clearCart } = useCartStore.getState();
      
      addItem(product1);
      addItem(product2);
      clearCart();
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("getTotal", () => {
    it("should calculate total price correctly", () => {
      const product1 = createMockProduct(1, "Product 1", 10.00);
      const product2 = createMockProduct(2, "Product 2", 20.00);
      const { addItem, getTotal } = useCartStore.getState();
      
      addItem(product1);
      addItem(product2);
      
      expect(getTotal()).toBe(30.00);
    });

    it("should account for item quantities in total", () => {
      const product = createMockProduct(1, "Test Product", 15.00);
      const { addItem, updateQuantity, getTotal } = useCartStore.getState();
      
      addItem(product);
      updateQuantity(product.id, 3);
      
      expect(getTotal()).toBe(45.00);
    });

    it("should return 0 for empty cart", () => {
      const getTotal = useCartStore.getState().getTotal;
      expect(getTotal()).toBe(0);
    });
  });

  describe("getItemCount", () => {
    it("should count all items including quantities", () => {
      const product1 = createMockProduct(1, "Product 1", 10.00);
      const product2 = createMockProduct(2, "Product 2", 20.00);
      const { addItem, getItemCount } = useCartStore.getState();
      
      addItem(product1);
      addItem(product1);
      addItem(product2);
      
      expect(getItemCount()).toBe(3);
    });

    it("should return 0 for empty cart", () => {
      const getItemCount = useCartStore.getState().getItemCount;
      expect(getItemCount()).toBe(0);
    });
  });
});