import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
   senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    text: {
        type: String,
        required: true,
    },
    mediatype: {
        type: String,
        enum:["Image","Video"],
        default: null,
    },
    
    mediaurlpublicId:{
        type: String,
    },
}, {
    timestamps: true,
 });

const Message = mongoose.model("Message", messageSchema);
export default Message;