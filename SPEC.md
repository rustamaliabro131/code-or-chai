# E-Commerce Store Specification

## 1. Project Overview
- **Name**: ShopEase - Modern E-Commerce Platform
- **Type**: Full-stack e-commerce web application
- **Core Functionality**: Product catalog, shopping cart, user authentication, checkout with Stripe payments, order management
- **Target Users**: Online shoppers and store administrators

## 2. Tech Stack

### Front-end
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Back-end
- **Runtime**: Node.js (via Next.js API routes)
- **Database**: SQLite (using better-sqlite3)
- **Authentication**: JWT

## 3. Features

### Customer Features
- Product browsing with categories
- Product search and filtering
- Shopping cart (add, remove, update quantity)
- User registration and login
- Checkout process
- Order history

### Admin Features
- Product management dashboard
- Order management and status updates
- View all orders and customer info

### Pages
- `/` - Home page with featured products and categories
- `/products` - All products with filtering and search
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout page with shipping and payment
- `/login` - User login
- `/register` - User registration
- `/orders` - Order history
- `/admin` - Admin dashboard

## 4. Design Language
- **Aesthetic**: Clean, modern, professional
- **Colors**: 
  - Primary: #2563EB (blue)
  - Secondary: #1E40AF (dark blue)
  - Accent: #F59E0B (amber)
  - Background: #F8FAFC (light gray)
  - Text: #1E293B (slate)
- **Typography**: Inter font family
- **Layout**: Grid-based product cards, responsive design

## 5. Data Models

### Product
- id, name, description, price, image, category, stock, createdAt

### User
- id, email, password (hashed), name, isAdmin, createdAt

### Order
- id, userId, total, status, stripePaymentId, shippingAddress, createdAt

### OrderItem
- id, orderId, productId, quantity, price

## 6. API Endpoints

### Products
- GET /api/products - List all products (with optional category filter)
- GET /api/products/[id] - Get single product
- PUT /api/products/[id] - Update product (admin)
- DELETE /api/products/[id] - Delete product (admin)

### Auth
- POST /api/auth/login - Login user
- POST /api/auth/register - Register user
- GET /api/auth/me - Get current user

### Orders
- GET /api/orders - List user orders (all orders for admin)
- POST /api/orders - Create new order
- GET /api/orders/[id] - Get order details
- PATCH /api/orders/[id] - Update order status (admin)