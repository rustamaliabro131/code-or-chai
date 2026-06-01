# ShopEase - E-Commerce Store

A modern full-stack e-commerce web application built with Next.js 14.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT

## Features

### Customer Features
- 🛍️ Browse products with categories and search
- 🔍 Filter products by category
- 🛒 Shopping cart with quantity management
- 👤 User registration and login
- 📦 Checkout with order confirmation
- 📜 Order history

### Admin Features
- 📊 Dashboard with stats
- 📦 Product management
- 📋 Order management and status updates

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Demo Credentials

### Admin Account
- Email: `admin@shopease.com`
- Password: `admin123`

### Regular User
Register a new account through the app.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with featured products |
| Products | `/products` | All products with filtering |
| Product Detail | `/products/[id]` | Single product view |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Order checkout |
| Login | `/login` | User login |
| Register | `/register` | User registration |
| Orders | `/orders` | Order history |
| Admin | `/admin` | Admin dashboard |

## Project Structure

```
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── store/         # Zustand stores
│   └── lib/           # Utilities and database
├── public/            # Static assets
└── package.json
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get single product

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/[id]` - Update order status

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)