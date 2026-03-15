import express from 'express';
import { protectedRoute } from '../utils/protectedroute.js';
import { deleteNotification, getNotifications } from '../controllers/notification.controllers.js';

const router=express.Router();


router.get("/all",protectedRoute,getNotifications);
router.delete("/delete/:notificationId",protectedRoute,deleteNotification)


export default router