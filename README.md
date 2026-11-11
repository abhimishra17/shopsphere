# ShopSphere – Multi-Vendor E-Commerce & Business Management Platform

ShopSphere is a full-stack, enterprise-grade multi-vendor e-commerce platform built with **Java 21**, **Spring Boot 3**, **MySQL 8**, and **React 18** (Vite + Tailwind CSS).

The platform covers the complete e-commerce and seller business lifecycle:
**Customer Discovery → Multi-variant Cart → Transactional Checkout → Stock Reservation → Seller Dispatch → Shipment Milestone Tracking → Returns & Refunds → Seller Profit & Expense Analytics → Admin Governance**.

---

## 🏗️ Project Architecture & Folder Structure

```
Advance Ecommerce/
├── backend/                           # Java 21 / Spring Boot 3 REST API
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/shopsphere/
│       │   │   ├── ShopSphereApplication.java
│       │   │   ├── config/            # SecurityConfig, CorsConfig, SwaggerConfig
│       │   │   ├── security/          # JwtService, CustomUserDetailsService, Filters
│       │   │   ├── exception/         # GlobalExceptionHandler, ResourceNotFoundException
│       │   │   ├── common/            # Standard ApiResponse<T>
│       │   │   ├── user/              # User, Addresses, Authentication, Roles
│       │   │   ├── seller/            # Seller Profile, KYC, Bank, Payouts
│       │   │   ├── product/           # Products, Variants (SKU/Size/Color), Images
│       │   │   ├── category/          # Hierarchical Categories
│       │   │   ├── inventory/         # Stock, Reserved Stock, Transactions, Logs
│       │   │   ├── cart/              # Cart & Cart Items
│       │   │   ├── order/             # Orders, Order Items (Snapshots), Status History
│       │   │   ├── payment/           # Payments, Transactions, Refunds (Razorpay)
│       │   │   ├── shipment/          # Shipments, Tracking Numbers, Milestones
│       │   │   ├── review/            # Product Reviews, Ratings
│       │   │   ├── coupon/            # Coupons, Percentage/Fixed Discounts
│       │   │   ├── notification/      # Real-time / In-app Notifications
│       │   │   └── analytics/         # Advanced SQL Reporting & Seller Profit Calc
│       │   └── resources/
│       │       └── application.yml
│       └── test/
│           └── java/com/shopsphere/
│
└── frontend/                          # React.js (Vite + Tailwind CSS)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx                    # Role-based routing (Customer, Seller, Admin)
        ├── main.jsx                   # Entry point with Auth & Cart Contexts
        ├── index.css                  # Tailwind styles
        ├── components/
        │   ├── Navbar/                # Main customer header with search & cart badge
        │   ├── Sidebar/               # Reusable side navigation for portals
        │   ├── Footer/                # Platform footer
        │   ├── ProductCard/           # Responsive product cards with ratings & price
        │   ├── DataTable/             # Generic responsive data table for dashboards
        │   └── Loader/                # Spinners & loading states
        ├── pages/
        │   ├── customer/              # Home, Products, ProductDetails, Cart, Checkout, MyOrders
        │   ├── seller/                # Dashboard, ManageProducts, Inventory, ManageOrders, Analytics
        │   └── admin/                 # Dashboard, Users, Sellers, Products, Reports
        ├── layouts/                   # MainLayout, SellerLayout, AdminLayout
        ├── services/                  # api.js (Axios + JWT), authService, productService, etc.
        ├── context/                   # AuthContext, CartContext
        ├── routes/                    # ProtectedRoute (Role-Based Access Control)
        ├── hooks/                     # Custom React hooks (e.g., useDebounce)
        └── utils/                     # Formatters (currency, dates)
```

---

## 🎯 Next Steps: Phased Implementation by User Stories

1. **User Story Epic 1: Database Foundation & Core Relational Schema**
   - User, Role, Address, and Seller entities
   - Category, Brand, Product, Product Variant, and Inventory entities with constraints & indexes
2. **User Story Epic 2: Authentication & Role-Based Access Control (RBAC)**
   - Registration, Login, JWT issuance and validation, Password encryption (BCrypt)
3. **User Story Epic 3: Multi-Vendor Catalog & Product Management**
   - Seller product CRUD, multi-variant management (SKU, size, color), customer search & filtering
4. **User Story Epic 4: Cart, Inventory Locking & Checkout Lifecycle**
   - Cart management, optimistic/pessimistic stock locking to prevent overselling, order placement
5. **User Story Epic 5: Payment Gateway Sandbox & Webhooks**
   - Razorpay test integration, payment signature verification, failure retry handling
6. **User Story Epic 6: Seller Fulfillment, Shipment Tracking & Returns**
   - Seller order status dispatch, tracking events, customer return requests
7. **User Story Epic 7: Business Financials, Profit Calculator & Admin Analytics**
   - Seller cost & net profit calculations, high-performance native SQL reports

