import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },

  description:{
    type:String
  },

  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  img:{
   type:String ,
    default :""
  },
  comment:[{
      text:{
        type:String,
        required:true
      },
      user:{
        type :mongoose.Schema.Types.ObjectId,
           ref:"User",
         required:true
      }
    }],

  upvotes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  downvotes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ]

},{timestamps:true})

export default mongoose.model("Discussion",discussionSchema)