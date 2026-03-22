import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import authroutes from "./routes/auth.routes.js";
import rideroutes from "./routes/ride.routes.js";
import notificationroutes from "./routes/notification.routes.js";
import postrouter from "./routes/post.routes.js";
import discussionroutes from "./routes/discussion.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

// ✅ Create HTTP server
const server = createServer(app);

// ✅ Attach Socket.IO to server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 Socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRide", (rideId) => {
    socket.join(rideId);
    console.log(`User joined ride: ${rideId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Export io (for controller use)
export { io };

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authroutes);
app.use("/api/v1/ride", rideroutes);
app.use("/api/v1/post", postrouter);
app.use("/api/v1/notification", notificationroutes);
app.use("/api/v1/discussion", discussionroutes);

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
});