import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: [
      "follow",
      "unfollow",
      "ride_join",
      "ride_leave",
      "like_the_post",
      "ride_like",
      "invite_for_the_ride",
    ],
    required: true
  },

  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride"
  },

  isRead: {
    type: Boolean,
    default: false
  }

},
{ timestamps:true }
);

export default mongoose.model("Notification",notificationSchema);