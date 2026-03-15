import express from "express";

import {
  createRideController,
  getAllRideController,
  getSingleRideController,
  joinedRidesByUserController,
  leaveRideController,
  ridesCreatedByUserController,
  addCommentInTheRideController,
  updateRideDetailsController,
  deleteRideController,
  joinRideController,
  updateRiderHistoryController,
  nearByRide,
  createNotificationForInvitedUser,
  joinInvitedUser,
} from "../controllers/ride.controller.js";

import { protectedRoute } from "../utils/protectedroute.js";

const router = express.Router();


router.post("/create", protectedRoute, createRideController);

router.get("/all", protectedRoute, getAllRideController);

router.get("/:rideID", protectedRoute, getSingleRideController);

router.get("/user/created", protectedRoute, ridesCreatedByUserController);

router.get("/user/joined", protectedRoute, joinedRidesByUserController);

router.post("/join/:rideId", protectedRoute, joinRideController);

router.post("/leave/:rideId", protectedRoute, leaveRideController);

router.post("/comment/:rideId", protectedRoute, addCommentInTheRideController);

router.put("/update/:rideId", protectedRoute, updateRideDetailsController);

router.delete("/delete/:rideId", protectedRoute, deleteRideController);

router.put("/complete/:rideId", protectedRoute, updateRiderHistoryController);

router.get("/nearby/search", protectedRoute, nearByRide);

router.post("/invite/:rideId/:invitedUserId", protectedRoute, createNotificationForInvitedUser)

router.post("/accept-invite/:rideId", protectedRoute, joinInvitedUser)


export default router;