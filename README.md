# 🍕 CraveDash - Full-Stack Food Ordering Platform
*Project 11: Production-ready Food Ordering & Delivery Web Application*

CraveDash is a modern, full-stack food delivery web application built with **React (Vite)**, **Node.js/Express**, and **Tailwind CSS**. It simulates real-world food ordering platforms like UberEats, DoorDash, and Deliveroo with end-to-end cart management, server-side price protection, real-time order tracking, and administrative controls.

---

## 🌟 Key Features

### 1. 👤 Authentication & Role-Based Access Control
- JWT-based authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- Passwords safely hashed with **bcryptjs**.
- Role management: **Customer** vs. **Admin / Restaurant Manager**.
- 1-Click Demo Logins for instant evaluation.

### 2. 🍔 Menu Browsing, Search & Dietary Filtering
- Filter dishes by 7+ culinary categories (*Burgers, Pizza, Asian, Pasta, Healthy, Desserts, Drinks*).
- Real-time client & server search by dish name and culinary description.
- **Pure Veg** toggle to isolate vegetarian dishes.
- Rich dish badges: prep time, user rating, review count, and popularity flags.

### 3. 🛒 Shopping Cart & Coupon Engine
- Floating cart badge with live quantity count.
- Slide-over cart drawer with increment/decrement steppers and item deletion.
- Coupon engine supporting percentage discounts (e.g. `CRAVE20` for 20% off) and flat discounts (`FIRST5`).
- Automatic free delivery calculation for orders over $45.
- Persistent cart state in `localStorage`.

### 4. 💳 Tamper-Proof Checkout & Server Price Verification
- Delivery address, contact phone, and custom delivery instructions.
- Payment method selector (*Credit Card / Stripe simulation, Cash on Delivery, Digital Wallet*).
- **Zero Client-Side Trust**: Client submits only `{ id, quantity }`; the server looks up true prices, verifies availability, and recalculates subtotal, tax (8%), and delivery fees server-side.

### 5. 📦 Live 4-Step Order Tracker
- Interactive order progression stepper:
  $$\text{Order Placed} \longrightarrow \text{Preparing Food} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$
- Estimated arrival time calculation.
- Detailed receipt recap with delivery address and itemized dish summary.
- One-click "Advance Step" demo control to test live status transitions.

### 6. 🛡️ Restaurant Management Hub (Admin)
- Live kitchen orders dashboard with order status toggles.
- Add new dishes to the restaurant catalog.
- Toggle item stock availability (*In Stock* vs. *Sold Out*).

---

## 📂 Project Structure

```text
Food-Website/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, HeroBanner, FoodCard, CartDrawer, CheckoutModal, etc.
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── services/           # api.js (HTTP fetch client)
│   │   ├── App.jsx             # Main Application Component
│   │   ├── index.css           # Tailwind CSS Base & Theme
│   │   └── main.jsx            # React 19 Entrypoint
│   ├── vite.config.js          # Vite config with API proxy
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── controllers/            # authController, menuController, orderController
│   ├── data/                   # mockData.js (seed items), store.js (transactional store)
│   ├── middleware/             # auth.js (JWT verify, admin guard)
│   ├── routes/                 # authRoutes, menuRoutes, orderRoutes
│   ├── .env                    # Server port and JWT secret configuration
│   ├── server.js               # Express server entry point
│   └── package.json
│
├── package.json                # Root package manager scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd server
npm run dev
```
*Backend runs on `http://localhost:5001`*

### 2. Start Frontend Client
In a second terminal:
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:5173`*

Or run from root:
```bash
npm run server   # starts express backend
npm run client   # starts vite react frontend
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@example.com` | `password123` | Browse, order, track delivery |
| **Admin** | `admin@example.com` | `admin123` | Update order statuses, add dishes, toggle stock |

*(You can also click the 1-click demo buttons inside the Sign In modal without typing credentials!)*

---

## 📡 API Reference Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server uptime and health check |
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/menu` | Public | Get all menu items with search & category filters |
| `GET` | `/api/menu/categories` | Public | Get list of food categories |
| `POST` | `/api/orders` | Public/Auth | Place new order with server-side price check |
| `GET` | `/api/orders/:id` | Public | Track specific order status |
| `GET` | `/api/orders/admin/all` | Admin | View all restaurant orders |
| `PATCH`| `/api/orders/admin/:id/status` | Admin | Update status of an order |
| `POST` | `/api/menu` | Admin | Create a new dish |
| `PUT`  | `/api/menu/:id` | Admin | Update dish details or stock availability |
