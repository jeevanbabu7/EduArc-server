import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ChatSession',
  },
  sender: {
    type: String,
    enum: ['user', 'bot'], 
    required: true,
  },
  content: {
    type: String, 
    required: true,
  },
}, {
  timestamps: true, 
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String, 
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message', 
    },
  ],
}, {
  timestamps: true,
});

export const Message = mongoose.model('Message', messageSchema);
export const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
