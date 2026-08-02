# 🏍️ RideSphere - Biker Portal

RideSphere is a full-stack MERN application built for motorcycle enthusiasts to plan rides, connect with other riders, and manage their bikes in one place. The platform provides secure authentication, ride planning, bike management, discussions, notifications, and real-time communication.

---

# 🚀 Features

### 🔐 Authentication

* User Registration & Login
* JWT Authentication
* Secure Password Hashing (bcrypt)
* Protected Routes

### 🏍️ Bike Garage

* Add multiple bikes
* Update bike information
* Delete bikes
* View personal garage

### 🗺️ Ride Planner

* Create new rides
* Join available rides
* View ride details
* Ride location using OpenStreetMap
* Geocoding with Nominatim API

### 💬 Real-Time Chat

* Live ride discussion
* Socket.IO based messaging
* Join ride-specific chat rooms

### 🔔 Notifications

* Ride updates
* Join requests
* Important announcements

### 👤 User Profile

* Update profile information
* Upload profile image
* Manage account

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

## Authentication

* JWT (JSON Web Token)
* bcrypt

## File Upload

* Multer
* Cloudinary

## Maps

* Leaflet
* OpenStreetMap
* Nominatim API

## Real-Time Communication

* Socket.IO

---

# 📂 Project Structure

```text
RideSphere/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   └── socket/
│
└── README.md
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone <repository-url>
cd RideSphere
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=2000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

---

# 📡 API Overview

## Authentication

* POST `/api/v1/auth/signup`
* POST `/api/v1/auth/login`
* POST `/api/v1/auth/logout`

## Users

* GET `/api/v1/user/profile`
* PUT `/api/v1/user/profile`

## Bikes

* POST `/api/v1/bikes`
* GET `/api/v1/bikes`
* PUT `/api/v1/bikes/:id`
* DELETE `/api/v1/bikes/:id`

## Rides

* POST `/api/v1/rides`
* GET `/api/v1/rides`
* GET `/api/v1/rides/:id`
* PUT `/api/v1/rides/:id`
* DELETE `/api/v1/rides/:id`

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Login
* Dashboard
* Ride Planner
* Bike Garage
* Ride Details
* Chat
* Notifications

---

# 🌟 Future Improvements

* Mobile application
* Route optimization
* Weather integration
* Emergency SOS
* Ride analytics
* Group ride invitations
* Push notifications
* Offline map support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Ganesh H**

If you found this project helpful, consider giving it a ⭐ on GitHub.
