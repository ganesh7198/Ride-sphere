import express from 'express';
import { protectedRoute } from '../utils/protectedroute.js';
import { getNotifications } from '../controllers/notification.controllers.js';

const router=express.Router();


router.get("/all",protectedRoute,getNotifications)

export default router