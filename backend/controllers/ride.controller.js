import Ride from "../models/ride.model.js";
import { generateStaticMapUrl } from "../utils/generatestaticmapurl.js";
import { getCoordinates } from "../utils/getcoordinates.js";
import { getRouteDetails } from "../utils/getroutesdetails.js";


export const createRideController = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      tittle,
      startLocationAddress,
      endLocationAddress,
      maxRiders,
      rideType,
      description,
      rideDate,
    } = req.body;

    
    if (!tittle || !startLocationAddress || !endLocationAddress || !rideDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

  
    const startLocation = await getCoordinates(startLocationAddress);
    const endLocation = await getCoordinates(endLocationAddress);

    if (!startLocation || !endLocation) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end location",
      });
    }

   
    const routeData = await getRouteDetails(
      startLocation.longitude,
      startLocation.latitude,
      endLocation.longitude,
      endLocation.latitude
    );

 
    const mapUrl = generateStaticMapUrl(
      startLocation.latitude,
      startLocation.longitude,
      endLocation.latitude,
      endLocation.longitude
    );

   
    const rideDateObj = new Date(rideDate);
    const today = new Date();

    rideDateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let rideStatus = "upcoming";

    if (rideDateObj.getTime() === today.getTime()) {
      rideStatus = "ongoing";
    } else if (rideDateObj.getTime() < today.getTime()) {
      rideStatus = "completed";
    }

    
    const newRide = await Ride.create({
      tittle,
      creator: userId,
      description,
      rideType,
      maxRiders,
      rideDate,
      status: rideStatus,

      startLocation: {
        address: startLocationAddress,
        location: {
          type: "Point",
          coordinates: [
            startLocation.longitude,
            startLocation.latitude,
          ],
        },
      },

      destination: {
        address: endLocationAddress,
        location: {
          type: "Point",
          coordinates: [
            endLocation.longitude,
            endLocation.latitude,
          ],
        },
      },

      distanceInKm: routeData.distanceInKm,
      estimatedDuration: routeData.durationInMinutes,
      mapImage: mapUrl,

      joinedMembers: [userId], 
    });

    return res.status(201).json({
      success: true,
      message: "Ride created successfully",
      ride: newRide,
    });

  } catch (error) {
    console.log("Error in createRideController:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllRideController= async (req,res)=>{
  try{
	//  need to rewrite this controller may be i will more  redefined/more sepicific it 
      const allRides=await Ride.find({status:{$ne:"completed"}}).sort({rideDate:1});
	  res.status(200).json({success:true,message:"all rides available", ride:allRides})
  }catch(error){
   console.log("error in the get all ride controller ",error.message);
   res.status(500).json({success:false,message:"intrnal server error"})
  }
}

export const getSingleRideController = async (req, res) => {
  try {
    const { rideID } = req.params;

    const rideDetails = await Ride.findById(rideID)
      .populate("createdBy")
      .populate("joinedRiders")
      .populate("comments")
    ;

    if (!rideDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    res.status(200).json({
      success: true,
      message: "Single ride fetched successfully",
      ride: rideDetails,
    });
  } catch (error) {
    console.log("Error in getSingleRideController:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const joinedRidesByUserController = async (req, res) => {
  try {
    const userId = req.user._id;

    const joinedRide = await Ride.find({
      joinedRiders: userId,
    }).populate("createdBy", "username email");

    if (joinedRide.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rides joined by user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rides joined by user fetched successfully",
      rides: joinedRide,
    });
  } catch (error) {
    console.log(
      "Error in joinedRidesByUserController:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const leaveRideController = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user._id;

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { $pull: { joinedRiders: userId } },
      { new: true } 
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully left the ride",
      ride,
    });

  } catch (error) {
    console.log("Error in leaveRideController:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const ridesCreatedByUserController = async (req, res) => {
  try {
    const userId = req.user._id;

    const rides = await Ride.find({ createdBy: userId })
      .sort({ rideDate: 1 }); // ascending order

    if (rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rides created by user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rides created by user fetched successfully",
      rides,
    });

  } catch (error) {
    console.log(
      "Error in ridesCreatedByUserController:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addCommentInTheRideController = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const { rideId } = req.params;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    const newComment = {
      userId,
      text,
    };

    ride.comments.push(newComment);

    await ride.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });

  } catch (error) {
    console.log(
      "Error in addCommentInTheRideController:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRideDetailsController = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user._id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    if (ride.status === "completed") {
  return res.status(400).json({
    success:false,
    message:"Completed rides cannot be updated"
  })
}

    if (ride.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this ride",
      });
    }

    const {
      title,
      startLocationAddress,
      endLocationAddress,
      maxRiders,
      rideType,
      description,
      rideDate,
    } = req.body;

    let startLocation = ride.startLocation;
    let destination = ride.destination;
    let distanceInKm = ride.distanceInKm;
    let estimatedDuration = ride.estimatedDuration;


    if (startLocationAddress || endLocationAddress) {
      const startAddress = startLocationAddress || ride.startLocation.address;
      const endAddress = endLocationAddress || ride.destination.address;

      const startCoords = await getCoordinates(startAddress);
      const endCoords = await getCoordinates(endAddress);

      if (!startCoords || !endCoords) {
        return res.status(400).json({
          success: false,
          message: "Invalid start or destination location",
        });
      }

      const routeData = await getRouteDetails(
        startCoords.longitude,
        startCoords.latitude,
        endCoords.longitude,
        endCoords.latitude
      );

      startLocation = {
        address: startAddress,
        location: {
          type: "Point",
          coordinates: [startCoords.longitude, startCoords.latitude],
        },
      };

      destination = {
        address: endAddress,
        location: {
          type: "Point",
          coordinates: [endCoords.longitude, endCoords.latitude],
        },
      };

      distanceInKm = routeData.distanceInKm;
      estimatedDuration = routeData.durationInMinutes;
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        title: title || ride.title,
        description: description || ride.description,
        rideType: rideType || ride.rideType,
        maxRiders: maxRiders || ride.maxRiders,
        rideDate: rideDate || ride.rideDate,
        startLocation,
        destination,
        distanceInKm,
        estimatedDuration,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Ride updated successfully",
      ride: updatedRide,
    });

  } catch (error) {
    console.log("Error in updateRideController:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteRideController = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "No ride found" });
    }

    const deletedRide = await Ride.findByIdAndDelete(rideId);

    res.status(200).json({
      success: true,
      message: "Ride deleted successfully",
      deletedRide,
    });
  } catch (error) {
    console.log("Error in deleteRideController:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const joinRideController = async (req, res) => {
  try {
    const { rideId } = req.params;
    const userId = req.user._id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "No ride found",
      });
    }

    if (ride.joinedRiders.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already joined this ride",
      });
    }

    const joinRide = await Ride.findByIdAndUpdate(
      rideId,
      { $push: { joinedRiders: userId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Rider joined successfully",
      joinRide,
    });
  } catch (error) {
    console.log("Error in joinRideController:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRiderHistoryController = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { riders } = req.body; 
    // riders = ["userId1", "userId2", "userId3"]

    if (!riders || riders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No riders provided",
      });
    }

    await User.updateMany(
      { _id: { $in: riders } }, 
      {
        $addToSet: { completedRides: rideId },
      }
    );

    res.status(200).json({
      success: true,
      message: "Ride added to riders history",
    });

  } catch (error) {
    console.log("error in update rider history controller", error.message);

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const nearByRide = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const rides = await Ride.find({
      status: { $in: ["upcoming", "ongoing"] }, 
      "startLocation.location": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10 km radius
        },
      },
    }).populate("createdBy", "username profileImg");

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });

  } catch (error) {
    console.log("error in the near by ride controller", error.message);

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};