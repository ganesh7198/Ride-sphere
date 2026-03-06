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
} from "../controllers/ride.controller.js";

import { protectedRoute } from "../utils/protectedroute.js";

const router = express.Router();


/* CREATE RIDE */
router.post("/create", protectedRoute, createRideController);


/* GET ALL RIDES */
router.get("/all", protectedRoute, getAllRideController);


/* GET SINGLE RIDE */
router.get("/:rideID", protectedRoute, getSingleRideController);


/* RIDES CREATED BY USER */
router.get("/user/created", protectedRoute, ridesCreatedByUserController);


/* RIDES JOINED BY USER */
router.get("/user/joined", protectedRoute, joinedRidesByUserController);


/* JOIN RIDE */
router.post("/join/:rideId", protectedRoute, joinRideController);


/* LEAVE RIDE */
router.post("/leave/:rideId", protectedRoute, leaveRideController);


/* ADD COMMENT */
router.post("/comment/:rideId", protectedRoute, addCommentInTheRideController);


/* UPDATE RIDE */
router.put("/update/:rideId", protectedRoute, updateRideDetailsController);


/* DELETE RIDE */
router.delete("/delete/:rideId", protectedRoute, deleteRideController);


/* UPDATE RIDER HISTORY */
router.put("/complete/:rideId", protectedRoute, updateRiderHistoryController);


/* NEARBY RIDES */
router.get("/nearby/search", protectedRoute, nearByRide);


export default router;