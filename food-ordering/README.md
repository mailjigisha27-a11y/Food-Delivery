# Tomato. - Food Ordering Website

A full-stack food ordering website built with the MERN stack (MongoDB, Express, React, Node.js). Customers can browse the menu, order food and track their orders. An admin can manage dishes and orders.

## Live Demo

- Website: https://food-delivery-jigisha1.vercel.app
- Backend API: https://tomato-food-api-kxcm.onrender.com

Note: the backend runs on a free Render plan and sleeps after about 15 minutes without visits. The first load can take up to one minute.

## Features

- Browse the menu and filter dishes by category (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)
- Add and remove dishes in the cart
- Sign up and log in with JWT authentication
- Place an order with a delivery form
- My Orders page with order status
- Admin page: view all orders, change order status, add and delete dishes
- Admin routes are protected on the backend with a role check

## Tech Stack

| Part | Technology |
|------|------------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Hosting | Vercel (frontend), Render (backend) |

## Project Structure

```
Food Deliver/
  Food Deliver/      React frontend (Vite)
  food-ordering/
    backend/         Express API
```

## Run Locally

### 1. Backend

```
cd food-ordering/backend
npm install
```

Create a `.env` file in the backend folder:

```
MONGO_URI=mongodb://localhost:27017/foodordering
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:5173
```

Start the server:

```
node server.js
```

### 2. Frontend

```
cd "Food Deliver"
npm install
npm run dev
```

The website opens at http://localhost:5173.

## Environment Variables

| Name | Where | Purpose |
|------|-------|---------|
| MONGO_URI | Backend (Render) | MongoDB connection link |
| JWT_SECRET | Backend (Render) | Secret used to sign login tokens |
| FRONTEND_URL | Backend (Render) | Website address allowed by CORS |
| VITE_API_URL | Frontend (Vercel) | Backend address used by the website |

## Author

Jigisha