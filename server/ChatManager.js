import User from './models/user.model.js';
import { ChatSession } from './models/conversation.model.js';
import { Message } from './models/conversation.model.js';
import ModelResponse from './utils/cohereModel.js';
import deepSeekResponse from './utils/deepSeekModel.js';
class ChatManager {
  constructor() {
    this.chatSessions = [];
  }

  async createChatSession(socket) {
    this.chatSessions.push(socket);
    this.addHandlers(socket);
  }

  addHandlers(socket) {
    socket.on('create-chat', async (userId) => {
      socket.emit('chat-created', JSON.stringify("Chat session created"));
      console.log('create-chat', userId);
      
      try {
        const user = await User.findById(userId);
        if(!user) {
            socket.emit('error', JSON.stringify("User not found"));
        }
        const newChatSession = new ChatSession({
            userId: userId,
        });
        const res = await newChatSession.save();
        console.log('Chat session created');
        socket.emit('chat-created', JSON.stringify("Chat session created"));
        
        
      }catch(error) {
          socket.emit('error', JSON.stringify("Something went wrong"));
      }
    });

    socket.on('send-message', async (message) => {
      try {
        const chatSession = await ChatSession.findById(message.chatSessionId);
        console.log(message);
        
      
        console.log(message.content);
        const newMessage = new Message({
            chatSessionId: message.chatSessionId,
            sender: message.sender,
            content: message.content,
        });
        console.log(chatSession);
        
        const res = await newMessage.save();
        console.log('Message saved');
        
        if(!chatSession) {
            socket.emit('error', JSON.stringify("Chat session not found"));
        }
        chatSession.messages.push(res._id);
    
        // FOR RAG MODEL
        // const res = await fetch('http://127.0.0.1:5000/api/query',{
        //   method: 'POST',
        //   headers: {
        //       'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({query: message.content}),
        // });

        // FOR GENERAL MODEL (commad r+)
        // const data = await ModelResponse(message.content);
        
        // FOR DEEPSEEK MODEL
        const data = await deepSeekResponse(message.content, socket);
        console.log(data);
        
        const modelMessage = new Message({
          chatSessionId: message.chatSessionId,
          sender: "bot",
          content: data, // data.answer for RAG model
        });
        const result = await modelMessage.save();
        // socket.emit('model_response', data); // data.answer for RAG model
        chatSession.messages.push(result._id);
    
        await chatSession.save();
        socket.emit('ack', JSON.stringify("you sent a message"));
      }catch(error) {
          socket.emit('error', JSON.stringify("Something went wrong"));
          console.log(error);
          
      }
    });
  }
}

export default ChatManager;