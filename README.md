# 🍳 DishDiary — Modern Culinary Journal & Recipe Sharing Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey?logo=express)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?logo=cloudinary)](https://cloudinary.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-orange.svg)](https://opensource.org/licenses/ISC)

> **DishDiary** is a full-stack digital cookbook and culinary community application designed for food enthusiasts, home cooks, and professional chefs. Discover chef-curated dishes, track interactive step-by-step timers, publish custom recipes with Cloudinary media storage, and personalize your chef profile.

---

## 🌟 Key Highlights & Features

### 🖥️ Frontend (Vanilla JS + Custom Design System)
- **Aesthetic Culinary UI:** Curated warm foodie color palette (`#ea580c`, `#2b2622`), glassmorphism cards, micro-animations, and responsive layout.
- **Hero Featured Carousel:** Interactive recipe showcase with timer badges, difficulty ratings, and one-click bookmarking.
- **Smart Category & Search Filtering:** Instant search by recipe title or ingredients, filter pills (Breakfast, Lunch, Dinner, Desserts, Quick & Easy), and dynamic sort (Highest Rated, Most Reviews, Cook Time).
- **Interactive Recipe Detail View (`recipe-detail.html`):**
  - Live interactive cooking countdown timer with visual progress bar.
  - Interactive ingredient check-off list to keep prep tidy.
  - Step-by-step instructions and nutritional breakdown.
- **Recipe Creator Studio (`add-recipe.html`):**
  - Drag-and-drop or file picker image upload directly to **Cloudinary**.
  - Automatic draft cleanup: clicking **"✕ Clear"** or uploading a replacement file automatically purges the old image from Cloudinary via backend API.
  - Live real-time card preview before publishing.
  - Disabled state with animated loading spinner on publish.
- **Chef Profile & Portfolio (`profile.html`):**
  - Facebook-style scalloped rosette **Verified Chef Badge**.
  - Instant avatar photo update with mini camera overlay button syncing to Cloudinary.
  - Tabbed recipe manager (*Published Dishes* vs *Saved Bookmarks*).
  - Profile customization modal (name, bio, role).
- **Continuous Slow-Motion Community Marquee:**
  - Buttery-smooth, infinite horizontal slider of authentic community reviews.
  - Smart **Pause on Hover & Touch** so foodies can comfortably read at their own pace.
  - Vignette edge gradient masks for a luxury visual finish.
- **VIP Newsletter Subscription:**
  - Modern animated subscription flow with custom button loader and celebration badge (no jarring native browser alerts).
- **Security & Session Flow:**
  - Reusable confirmation modal for safe account logout.
  - Persistent login state stored in `localStorage` syncing with backend JWT tokens.

---

### ⚙️ Backend (Node.js + Express + TypeScript + Prisma)
- **Strictly Typed Architecture:** Clean modular MVC design using TypeScript.
- **Prisma ORM & MongoDB Atlas:** Schema modeling for Users and Recipes with seamless relations and automated migrations (`prisma db push`).
- **Secure Authentication:**
  - Passwords hashed using `bcrypt`.
  - Stateless JSON Web Tokens (`jsonwebtoken`) with role-based access (`user` vs `admin`).
- **Cloudinary Media Engine:** Direct multi-part image uploads via `multer` memory storage piped directly to Cloudinary CDN, plus backend endpoint for deleting unused media by `public_id`.
- **Robust Error Handling:** Centralized `AppError`, `catchAsync`, and `globalErrorHandler` handling validation issues, Prisma errors, and HTTP status codes cleanly.

---

## 📂 Project Architecture

```plaintext
Dish-Diary/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema for MongoDB Atlas
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/           # Environment variables configuration
│   │   │   ├── error/            # Centralized error classes & handlers
│   │   │   ├── lib/              # Prisma client & Cloudinary helpers
│   │   │   ├── middlewares/      # Auth guard, error handling, validation
│   │   │   ├── modules/          # Feature modules (auth, user, recipe, upload)
│   │   │   │   ├── auth/
│   │   │   │   ├── recipe/
│   │   │   │   ├── upload/
│   │   │   │   └── user/
│   │   │   └── routes/           # Main API router registry
│   │   ├── app.ts                # Express app configuration & middlewares
│   │   └── server.ts             # Server bootstrapper & port listener
│   ├── .env.example              # Sample environment variables
│   ├── package.json              # Backend dependencies and scripts
│   └── tsconfig.json             # TypeScript compiler settings
│
├── frontend/
│   ├── add-recipe.html           # Recipe creation studio
│   ├── add-recipe.js             # Studio logic & Cloudinary upload integration
│   ├── app.js                    # Main homepage logic & interactive features
│   ├── auth.js                   # Client-side login & register handler
│   ├── index.html                # Main homepage & discovery portal
│   ├── login.html                # Authentication portal (Sign In / Sign Up)
│   ├── profile.html              # Chef profile & recipe management page
│   ├── profile.js                # Profile updates, avatar change & tabs
│   ├── recipe-detail.html        # Comprehensive recipe detail view
│   ├── recipe-detail.js          # Interactive cooking timer & checklists
│   └── style.css                 # Master design system & component styles
│
├── .gitignore
├── index.html                    # Root redirector for GitHub Pages/Vercel
└── README.md                     # Documentation
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database cluster
- A free [Cloudinary](https://cloudinary.com/) account for image hosting

---

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` root:
   ```env
   NODE_ENV=development
   PORT=5942
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/dishdiary?retryWrites=true&w=majority"
   JWT_SECRET="super_secret_dishdiary_jwt_key_2026"
   JWT_EXPIRES_IN="7d"

   # Cloudinary Media Configuration
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Sync Prisma with MongoDB:**
   ```bash
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5942`.*

---

### 3. Frontend Setup

1. DishDiary's frontend is purely static and requires **no build step**.
2. You can launch it using **VS Code Live Server** or any static HTTP server:
   ```bash
   # From root or frontend directory:
   npx serve frontend
   ```
   Or open `frontend/index.html` via Live Server (`http://127.0.0.1:5500/frontend/index.html`).

---

## 📡 API Reference Overview

### **Auth Endpoints** (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new chef account | No |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT token | No |

### **User Endpoints** (`/api/v1/user`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/user/me` | Fetch active user profile | Yes (Bearer) |
| `PATCH` | `/api/v1/user/me` | Update chef name or profile data | Yes (Bearer) |

### **Recipe Endpoints** (`/api/v1/recipes`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/recipes` | List all published recipes | No |
| `GET` | `/api/v1/recipes/:id` | Fetch specific recipe by ID | No |
| `POST` | `/api/v1/recipes` | Publish a new recipe | Yes (Bearer) |
| `DELETE`| `/api/v1/recipes/:id` | Remove a recipe | Yes (Bearer) |

### **Media Upload Endpoints** (`/api/v1/upload`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/upload` | Upload image file to Cloudinary | Optional |
| `DELETE`| `/api/v1/upload` | Delete image by `public_id` or `url` | Optional |

---

## 🛠️ Built With

- **Frontend:** HTML5, CSS3 Custom Variables, Vanilla JavaScript (ES6+), Google Fonts (Playfair Display & Plus Jakarta Sans).
- **Backend:** Node.js, Express.js, TypeScript, ts-node-dev.
- **Database & ORM:** MongoDB Atlas, Prisma ORM.
- **Media Hosting:** Cloudinary CDN & Multer.
- **Security:** Helmet, CORS, JSON Web Tokens, BCrypt, Cookie-Parser.

---

## 📄 License

This project is licensed under the **ISC License**. Feel free to customize and expand it for your own culinary projects!
