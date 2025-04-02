# Oii - Fashion E-commerce Website

A modern e-commerce platform for fashion products built with React and Node.js.

## Features

- Responsive design for all devices
- User authentication and authorization
- Product catalog with search and filtering
- Shopping cart and wishlist functionality
- Secure checkout process
- Admin dashboard for product management
- Order tracking and history
- Customer reviews and ratings

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   ```

2. Create a .env file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Start the development server:
   ```bash
   # Run backend and frontend concurrently
   npm run dev

   # Or run separately:
   npm start         # Backend
   npm run client   # Frontend
   ```

4. Open http://localhost:3000 to view the website

## Tech Stack

- Frontend: React, Material-UI, Redux Toolkit
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer

## Project Structure

```
oii/
├── frontend/           # React frontend
├── backend/           # Node.js backend
├── public/            # Static files
└── package.json       # Project dependencies
```
