import mongoose from "mongoose";

const messageschema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true,
        default: "Text"
    },
    messageStatus: {
        type: String,
        required: true,
        default: "sent"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageschema);

export default Message;
