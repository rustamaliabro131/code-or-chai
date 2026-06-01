import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

const dbPath = path.join(process.cwd(), "shop.db");
const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      isAdmin INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT,
      stock INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      stripePaymentId TEXT,
      shippingAddress TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER,
      productId INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `);

  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  
  if (productCount.count === 0) {
    const products = [
      { name: "Wireless Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life", price: 149.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d6e1?w=400", category: "Electronics", stock: 25 },
      { name: "Smart Watch Pro", description: "Advanced smartwatch with health monitoring and GPS", price: 299.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", category: "Electronics", stock: 15 },
      { name: "Leather Backpack", description: "Premium genuine leather backpack with laptop compartment", price: 89.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", category: "Fashion", stock: 30 },
      { name: "Running Shoes", description: "Lightweight breathable running shoes with cushioned sole", price: 79.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", category: "Sports", stock: 40 },
      { name: "Coffee Maker", description: "Automatic drip coffee maker with programmable timer", price: 59.99, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400", category: "Home", stock: 20 },
      { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness and USB charging", price: 45.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400", category: "Home", stock: 35 },
      { name: "Bluetooth Speaker", description: "Portable waterproof speaker with 360-degree sound", price: 69.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", category: "Electronics", stock: 25 },
      { name: "Yoga Mat", description: "Non-slip exercise mat with carrying strap", price: 34.99, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", category: "Sports", stock: 50 },
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (name, description, price, image, category, stock) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const p of products) {
      insertProduct.run(p.name, p.description, p.price, p.image, p.category, p.stock);
    }
  }

  const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE isAdmin = 1").get() as { count: number };
  
  if (adminCount.count === 0) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    db.prepare("INSERT INTO users (email, password, name, isAdmin) VALUES (?, ?, ?, 1)")
      .run("admin@shopease.com", hashedPassword, "Admin");
  }
}

export default db;

export function getUserByEmail(email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function getUserById(id: number) {
  return db.prepare("SELECT id, email, name, isAdmin, createdAt FROM users WHERE id = ?").get(id);
}

export function createUser(email: string, password: string, name: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
    .run(email, hashedPassword, name);
  return getUserByById(result.lastInsertRowid as number);
}

function getUserByById(id: number) {
  return db.prepare("SELECT id, email, name, isAdmin, createdAt FROM users WHERE id = ?").get(id);
}

export function getProducts(category?: string) {
  if (category) {
    return db.prepare("SELECT * FROM products WHERE category = ?").all(category);
  }
  return db.prepare("SELECT * FROM products").all();
}

export function getProductById(id: number) {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id);
}

export function createProduct(data: { name: string; description: string; price: number; image: string; category: string; stock: number }) {
  const result = db.prepare(`
    INSERT INTO products (name, description, price, image, category, stock) 
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(data.name, data.description, data.price, data.image, data.category, data.stock);
  return getProductById(result.lastInsertRowid as number);
}

export function updateProduct(id: number, data: { name?: string; description?: string; price?: number; image?: string; category?: string; stock?: number }) {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
  if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
  if (data.price !== undefined) { fields.push("price = ?"); values.push(data.price); }
  if (data.image !== undefined) { fields.push("image = ?"); values.push(data.image); }
  if (data.category !== undefined) { fields.push("category = ?"); values.push(data.category); }
  if (data.stock !== undefined) { fields.push("stock = ?"); values.push(data.stock); }

  if (fields.length > 0) {
    values.push(id);
    db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  }
  return getProductById(id);
}

export function deleteProduct(id: number) {
  return db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function createOrder(userId: number, total: number, items: { productId: number; quantity: number; price: number }[], stripePaymentId?: string, shippingAddress?: string) {
  const result = db.prepare("INSERT INTO orders (userId, total, stripePaymentId, shippingAddress, status) VALUES (?, ?, ?, ?, 'completed')")
    .run(userId, total, stripePaymentId || null, shippingAddress || null);
  const orderId = result.lastInsertRowid as number;

  const insertItem = db.prepare("INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)");
  for (const item of items) {
    insertItem.run(orderId, item.productId, item.quantity, item.price);
  }

  return getOrderById(orderId);
}

export function getOrdersByUserId(userId: number) {
  const orders = db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC").all(userId) as any[];
  
  return orders.map(order => ({
    ...order,
    items: getOrderItems(order.id)
  }));
}

export function getAllOrders() {
  const orders = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all() as any[];
  
  return orders.map(order => ({
    ...order,
    items: getOrderItems(order.id),
    user: getUserById(order.userId)
  }));
}

export function getOrderById(id: number) {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
  if (order) {
    order.items = getOrderItems(id);
  }
  return order;
}

function getOrderItems(orderId: number) {
  const items = db.prepare(`
    SELECT oi.*, p.name as productName, p.image as productImage 
    FROM order_items oi 
    JOIN products p ON oi.productId = p.id 
    WHERE oi.orderId = ?
  `).all(orderId) as any[];
  
  return items.map(item => ({
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    product: {
      id: item.productId,
      name: item.productName,
      image: item.productImage,
      price: item.price
    }
  }));
}

export function updateOrderStatus(id: number, status: string) {
  return db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
}