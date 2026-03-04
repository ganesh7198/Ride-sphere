import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
  
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

 
    startLocation: {
      address: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], 
          required: true,
        },
      },
    },

    destination: {
      address: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

   
    rideDate: {
      type: Date,
      required: true,
    },


    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   
    joinedRiders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

 
    maxRiders: {
      type: Number,
      default: 10,
    },


    status: {
      type: String,
      enum: ["open", "closed", "completed"],
      default: "open",
    },

   
    rideType: {
      type: String,
      default: "highway",
    },
    
    status: {
  type: String,
  enum: ["upcoming", "ongoing", "completed", "cancelled"],
  default: "upcoming",
},

 
    distanceInKm: {
      type: Number,
    },

    estimatedDuration: {
      type: Number,
    },

    rideImage: {
      type: String,
	  default :""
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

rideSchema.index({ "startLocation.location": "2dsphere" });

export default mongoose.model("Ride", rideSchema);