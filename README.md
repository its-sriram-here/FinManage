# Personal Finance Manager

A full-stack MERN application to track income, expenses, and manage monthly budgets. Developed with a clean, responsive, and professional UI.

## 🚀 Tech Stack

### Frontend
- **React.js** (scaffolded with Vite)
- **Tailwind CSS** (for mobile-first, professional utility-class styling)
- **React Router v6** (for seamless client-side routing)
- **Axios** (for API communication and JWT interception)
- **Context API** (for global state management of Auth and Finance metrics)

### Backend
- **Node.js & Express.js**
- **MongoDB Atlas & Mongoose** (with Aggregation pipelines for dashboard summaries)
- **JSON Web Tokens (JWT)** (for protected routes)
- **bcryptjs** (for password hashing with 10 salt rounds)
- **express-validator** (for request input validation)

## ✨ Features

- **Secure Authentication**: Register and login with hashed passwords and JWT. Private routes are protected.
- **Interactive Dashboard**: View total income, total expense, and net savings in **Indian Rupees (₹)** with modern aggregation.
- **Budget Management**: Set and update monthly limits with dynamic color-coded warnings.
- **Transaction Tracking**: Comprehensive CRUD operations for Income/Expenses with INR formatting.
- **Dedicated About Page**: A premium screen featuring the application mission, full **Tech Stack**, and a hidden, hover-peek **Developer Card** for Sriram.
- **Premium UI/UX**: Full "SaaS" look with glassmorphism, smooth animations, and a mobile-first responsive layout.

## 📂 Project Structure (Strict MVC)

The application separates concerns between the server and the client strictly:

```text
/Personal Finance Manager
├── /client                # React Frontend
│   ├── /src
│   │   ├── /components    # Shared UI blocks (Navbar, Layout, ProtectedRoute)
│   │   ├── /context       # Global Stores (AuthContext, FinanceContext)
│   │   ├── /pages         # Feature-bound screen pages (Dashboard, Login, About, etc.)
│   │   ├── /services      # API interaction definitions (api.js)
│   │   └── App.jsx
│   └── tailwind.config.js
└── /server                # Node Backend
    ├── /config            # Database connections
    ├── /controllers       # Core business logic logic functions
    ├── /middleware        # Auth and Error handling
    ├── /models            # Mongoose Schemas (User, Transaction, Budget)
    ├── /routes            # Express Route definitions
    ├── /utils             # Helper functions (generateToken.js)
    └── server.js          # API App Entry point
```

## 🛠 Setup Instructions

### Prerequisites
Make sure you have Node.js and MongoDB installed or have a MongoDB Atlas connection string.

### 1. Backend Setup
1. Open the `/server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables. Create a `.env` file in `/server` based on the below schema:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_super_secret_jwt_signature_key>
   ```
4. Start the backend DEV server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### 2. Frontend Setup
1. Open the `/client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite DEV server:
   ```bash
   npm run dev
   # Client runs on http://localhost:5173
   ```

## 🔗 API Endpoints Summary

### Auth (`/api/auth`)
- `POST /register` : Register a new user
- `POST /login` : Authenticate user & get token
- `GET /me` : Get logged-in user details (Protected)

### Transactions (`/api/transactions`)
- `GET /` : Get user's transactions (Can pass `?month=YYYY-MM`) (Protected)
- `POST /` : Create a new transaction (Protected)
- `PUT /:id` : Update transaction (Protected)
- `DELETE /:id` : Delete transaction (Protected)

### Budgets (`/api/budgets`)
- `GET /:month` : Get tracking budget for a specific month (Protected)
- `POST /` : Set or update budget for a specific month (Protected)
- `GET /summary/:month` : Get aggregation summary (Total Income, Expense, Net) (Protected)

---
*Built by Sriram - MERN Stack Developer*
