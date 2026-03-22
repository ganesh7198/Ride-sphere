import express from 'express'
import { loginController, logoutController, myprofileController, signupController, updateProfileController, userProfileController } from '../controllers/auth.controllers.js';
import { protectedRoute } from '../utils/protectedroute.js';
import upload from '../middlewares/multer.middlewares.js';

const router= express.Router();

router.post("/signup",upload.single("profileImg"),signupController);
router.post("/login",loginController);
router.get("/myprofile",protectedRoute,myprofileController);
router.get("/user/profile/:userId",protectedRoute,userProfileController)
router.post("/updateprofile",protectedRoute,upload.single("profileImg"),updateProfileController);
router.post("/logout",protectedRoute,logoutController);


export default router;