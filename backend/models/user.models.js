import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,         
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    fullName: {
      type: String,
      required: true,         
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,           
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profileImg: {
      type: String,         
      default: "",
    },

    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
    completedRides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",         
      },
    ],
  },
  { timestamps: true }
);

const User= mongoose.model("User",userSchema);
export default User;
