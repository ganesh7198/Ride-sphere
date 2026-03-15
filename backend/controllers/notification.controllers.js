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


export const deleteNotification = async (req, res) => {
  try {

    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "No notification found"
      });
    }
    if (notification.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this notification"
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.log("Error in deleteNotification controller:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};