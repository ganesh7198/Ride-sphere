import express from 'express'
import { protectedRoute } from '../utils/protectedroute.js';
import { createRideController } from '../controllers/ride.controller.js';

const router= express.Router()

router.post("/create",protectedRoute,createRideController);



export default router;