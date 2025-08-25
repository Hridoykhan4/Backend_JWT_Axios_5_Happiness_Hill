🏨 Hotel Happiness Hill
Project Description
Welcome to Hotel Happiness Hill, a modern and intuitive full-stack web application for managing hotel bookings and services. This project is built with the MERN stack (MongoDB, Express.js, React, Node.js), providing a robust and scalable solution for both guests and administrators.

The application allows guests to browse available rooms, view details, and make reservations effortlessly. On the other hand, hotel staff can manage rooms, bookings, and user accounts through a dedicated admin panel. The user-friendly interface is designed to provide a seamless experience, ensuring guests feel right at home while making their stay as comfortable as possible.

Live Demo
Experience the application live by visiting the following link:
https://hotel-happiness-hill.web.app

Features
Browse Rooms: Guests can easily browse through a variety of rooms with high-quality images and detailed descriptions.

Secure Authentication: Users can register and log in securely using Firebase authentication.

Booking Management: Guests can view and manage their reservations, including updating or canceling bookings.

Admin Dashboard: A dedicated dashboard for hotel staff to manage rooms, user accounts, and all bookings.

Dynamic User Interface: The application features a clean, responsive, and modern design built with Tailwind CSS.

Efficient Data Fetching: Utilizes @tanstack/react-query for efficient data fetching, caching, and state management on the client side.

Technologies Used
This project is built using a combination of powerful and modern technologies.

Frontend
React: A popular JavaScript library for building user interfaces.

Vite: A fast build tool for modern web projects.

React Router DOM: For handling routing within the application.

React Query: Manages server state and data fetching.

Tailwind CSS: A utility-first CSS framework for rapid styling.

Firebase: For secure user authentication.

Backend
Node.js: A JavaScript runtime environment.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

MongoDB: A NoSQL database for storing application data.

JSON Web Tokens (JWT): For secure authentication between client and server.

CORS: To enable cross-origin requests.

Getting Started
Follow these steps to set up and run the project locally on your machine.

Prerequisites
Node.js: Make sure you have Node.js installed on your system.

MongoDB: Ensure you have a MongoDB instance running or a connection string to a cloud-hosted database.

Installation
Clone the repository:

git clone https://github.com/your-username/hotel-happiness-hill.git
cd hotel-happiness-hill

Install frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server # Assuming your backend is in a 'server' directory
npm install

Configuration
Backend Environment Variables:
Create a .env file in the root of your backend directory (server/) and add the following variables:

PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Replace your_mongodb_connection_string and your_secret_key with your actual values.

Frontend Firebase Configuration:
Configure your Firebase project for the frontend. You can find your credentials in the Firebase console.

Running the Project
Start the backend server:
From the backend directory (server/), run:

npm run dev

The server will start on http://localhost:5000.

Start the frontend application:
In a new terminal, from the frontend directory (client/), run:

npm run dev

The client application will be accessible at http://localhost:5173 (or another port specified by Vite).

Project Structure
.
├── client/ # Frontend (React)
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── vite.config.js
└── server/ # Backend (Node.js/Express)
├── index.js
├── routes/
├── models/
├── package.json
└── .env
