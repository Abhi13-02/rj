# RJ Traditional – E-Commerce Website for Ethnic Fashion

## 🚀 Highlights 
- **Full-Stack MERN Project (Next.js + MongoDB + Node.js + TypeScript)**  
- **Real-world Freelance Build** – Developed as part of a client project, demonstrating production-level work.  
- **Key Features:** Product catalog, search/filtering, cart, checkout, Google OAuth login, Razorpay payments, order tracking with Shiprocket.  
- **Modern Tech Stack:** NextAuth, Zustand, React Query, Cloudflare R2 storage.  
- **Scalable & Maintainable Design:** Clean architecture with environment-based configuration and modular code.  
- **Responsive UI:** Optimized for mobile and desktop with Tailwind styling.  

--- 
RJ Traditional is a full-stack e-commerce web application built for a traditional clothing retailer. It allows customers to browse and purchase Indian ethnic wear (such as sarees, lehengas, suits, kurtis, and dupattas) through a seamless online shopping experience. The platform was developed as part of a freelance assignment to showcase a complete end-to-end e-commerce solution, from product listings and shopping cart management to secure checkout and order tracking.

## Tech Stack

- **Frontend:** Next.js (React) with Tailwind CSS for styling  
- **Backend:** Next.js API routes (Node.js/Express under the hood)  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** NextAuth (Google OAuth 2.0 login)  
- **Payments:** Razorpay integration for payment processing (online payments)  
- **Storage:** Cloudflare R2 (S3-compatible object storage) for product images  
- **State Management:** Zustand (global state) and React Query (data fetching/caching)  
- **Language:** TypeScript (for type-safe development)

## Features

- **Product Catalog & Categories:** Browse a rich catalog of products organized by categories (Sarees, Lehengas, Suits, Kurtis, Dupattas, etc.). Users can view detailed product pages with multiple images (zoom enabled) and available size options.  
- **Search & Filtering:** Quick product search with suggestions. Filter products by categories, and price range (interactive slider) to find items easily.  
- **Shopping Cart:** Add products to a cart with selected quantities and sizes. Update item quantities or remove items. Cart persistently shows total price and updates as changes are made.  
- **Wishlist:** Save favorite products to a wishlist for future viewing or purchase. Logged-in users can add or remove items from their personal wishlist.  
- **User Authentication:** Secure user accounts with Google OAuth via NextAuth. Users can sign in with their Google account to manage their cart, wishlist, and orders.  
- **Checkout & Payment:** A step-by-step checkout process collects shipping details and allows users to place orders. Integrated **Razorpay** payment gateway for processing credit/debit card or UPI payments. Payments are verified securely before order confirmation.  
- **Order Management:** After checkout, orders are saved in the system. Users can view their order history in a "Your Orders" section, which shows order details and current status. Real-time shipping status updates are fetched via the **Shiprocket** API integration, and users can even cancel orders that haven’t shipped.  
- **Admin Panel (Order Administration):** *(Planned)* Basic admin functionality to manage orders. An authorized admin can update order statuses (e.g., mark as Shipped or Delivered) to keep customers informed. (This is facilitated by a protected API endpoint for updating order status.)  
- **Responsive UI & UX:** Mobile-friendly and responsive design. Includes features like a sliding image banner on the homepage, a sticky navigation bar with dropdown menus, and toast notifications (via React-Toastify) for feedback on actions (e.g., item added to cart, order placed successfully).  
- **Inventory Tracking:** Product stock is tracked per size. The system ensures accurate availability display and can prevent ordering out-of-stock items.  
