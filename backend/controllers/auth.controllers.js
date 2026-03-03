import User from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generatetokenandsetcookies.js";

export const signupController = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    let profileImgUrl = "";

    // ✅ Required fields check
    if (!username || !fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ✅ Check if username OR email exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // ✅ Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "biker-app",
      });

      profileImgUrl = result.secure_url;

      fs.unlinkSync(req.file.path); 
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);



    // ✅ Create new user
    const newUser = new User({
      username,
      fullName: fullname, 
      email,
      password: hashedPassword,
      profileImg: profileImgUrl || "",
      bio: "",
    });

    await newUser.save();

	// Generate JWT Token 
      generateTokenAndSetCookie(newUser._id,res);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        profileImg: newUser.profileImg,
      },
    });

  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find user
    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const checkPassword = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate JWT
    generateTokenAndSetCookie(existedUser._id, res);

    res.status(200).json({
      success: true,
      message: "User login successfully",
      user: {
        _id: existedUser._id,
        username: existedUser.username,
        email: existedUser.email,
        profileImg: existedUser.profileImg,
      },
    });

  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const myprofileController = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User information",
      userInfo: user,
    });

  } catch (error) {
    console.log("Error in myProfile controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, bio } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profileImgUrl = user.profileImg;

    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "biker-app",
      });

      profileImgUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

   
    if (fullname) user.fullName = fullname;
    if (bio) user.bio = bio;
    user.profileImg = profileImgUrl;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        bio: user.bio,
        profileImg: user.profileImg,
      },
    });

  } catch (error) {
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });

  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};