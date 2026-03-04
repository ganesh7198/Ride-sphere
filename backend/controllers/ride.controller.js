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
	//  need to rewrite this controller may be i will more  redefined it 
      const allRides=await Ride.find({status:{$ne:"completed"}}).sort({rideDate:1});
	  res.status(200).json({success:true,message:"all rides available", ride:allRides})
  }catch(error){
   console.log("error in the get all ride controller ",error.message);
   res.status(500).json({success:false,message:"intrnal server error"})
  }
}

export const getSingleRideController = async (req, res) => {
 try{

 }catch(error){
     console.log('error in the get single ride  controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
   }  
}

export const joinedRidesByUserController=async (req,res)=>{
   try{

   }catch(error){
         console.log('error in the joined rides by user  controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})  
   }
}

export const leaveRideController = async (req, res) => {
   try{

   }catch(error){
      console.log('error in the leave ride controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
 
   }
}

export const ridesCreatedByUserController=async (req,res)=>{
  try{
	
  }catch(error){
console.log('error in the ridees created by user  controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
    
  }
}

export const addCommentInTheRideController=async(req,res)=>{
  try{

  }catch(error){
    console.log('error in the add comment in the ride controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
    
  }
}

export const updateRidesDetailsController=async (req,res)=>{
   try{

   }catch(error){
     console.log('error in the update rides delete controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
    
   }
}

export const deleteRideController=async (req,res)=>{
   try{
	
   }catch(error){
     console.log('error in the delete ride controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
   
   }
}

export const joinRideController= async (req,res)=>{
  try{

  }catch(error){
    console.log('error in the join ride controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
  }
}


export const updateRiderHistroyController=async (req,res)=>{
   try{

   }catch(error){
        console.log('error in the update rider histroy controller ',error.message)
		res.status(500).json({success:false,message:"intrnal server error"})
   }  
}
