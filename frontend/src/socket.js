
import { io } from "socket.io-client";

export const socket = io("https://ride-sphere-1.onrender.com", {
  withCredentials: true,
});