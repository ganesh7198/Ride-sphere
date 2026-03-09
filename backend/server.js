import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db.js";
import authroutes from './routes/auth.routes.js';
import rideroutes from './routes/ride.routes.js';
import notificationroutes from './routes/notification.routes.js'
import postrouter from './routes/post.routes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/auth",authroutes);
app.use("/api/v1/ride",rideroutes);
app.use("/api/v1/post",postrouter);
app.use("/api/v1/notification",notificationroutes)

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
});