import Notification from "../models/notification.models.js"

export const getNotifications = async (req,res)=>{
  try{

    const userId=req.user._id;

    const notifications=await Notification.find({
      receiver:userId
    })
    .populate("sender","username profileImg")
    .populate("ride","tittle")
    .sort({createdAt:-1});

    res.status(200).json({
      success:true,
      notifications
    });

  }catch(error){
    console.log("error fetching notifications",error.message);

    res.status(500).json({
      success:false,
      message:"internal server error"
    });
  }
};