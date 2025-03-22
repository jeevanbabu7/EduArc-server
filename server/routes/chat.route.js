import express from 'express';
import User from '../models/user.model.js';
import { ChatSession, Message } from '../models/conversation.model.js';
const router = express.Router();

router.post('/new-chat', async (req, res) => {
    console.log("new chat");
    
  const { userId } = req.body;
//   console.log("new chat", userId);
  
  try {
    const user = await User.find({userId});
    
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    const newChatSession = await ChatSession({ userId });
    
    const response = await newChatSession.save();
    
    res.status(201).json({ chatSession: response });
  }catch(error) {
      res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get("/get-messages/:chatSessionId", async (req, res) => {
    const { chatSessionId } = req.params;
    console.log(chatSessionId);
    
    try {
        const chatSession = await ChatSession.findById(chatSessionId).populate("messages");
        if(!chatSession) {
            console.log("error");
            
            return res.status(404).json({ message: 'Chat session not found' });
        }
        res.status(200).json({messages: chatSession.messages});
    }catch(error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get("/get-chat-sessions/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log('history',userId);
    
    try {
        const chatSessions = await ChatSession.find({userId: userId});
        res.status(200).json({ chatSessions });
    }catch(error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.post('/send-message', async (req, res) => {
    try{
        const { chatSessionId, sender, content } = req.body;
        const chatSession = await ChatSession.findById(chatSessionId);
        const newMessage = new Message({
            chatSessionId,
            sender,
            content
        });
        // console.log(chatSession);
        
        const response = await newMessage.save();
        console.log('Message saved');
        
        if(!chatSession) {
            socket.emit('error', JSON.stringify("cd secChat session not found"));
        }
        chatSession.messages.push(response._id);
        await chatSession.save();
        res.status(201).json({message: response});
    }catch(err) {
        res.status(500).json({message: err.message});
    }
});

router.delete("/delete-chat-session/:chatSessionId", async (req, res) => {
    try {
        // console.log("delete chat");
        
        const { chatSessionId } = req.params;
        const chatSession = await ChatSession.findByIdAndDelete(chatSessionId);
        if(!chatSession) {
            return res.status(404).json({ message: 'Chat session not found' });
        }
        res.status(200).json({ message: 'Chat session deleted successfully' });
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
});


export default router;