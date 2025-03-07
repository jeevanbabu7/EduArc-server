import express from 'express';
import User from '../models/user.model.js';
import { ChatSession } from '../models/conversation.model.js';
const router = express.Router();

router.post('/new-chat', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await ChatSession.create({ userId });
    res.status(201).json({ message: 'Chat session created' });
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

export default router;