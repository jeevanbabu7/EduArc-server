import express from 'express'
import Summary from '../models/summary.model.js';

const Router = express.Router();

Router.post('/new-summary', async (req, res) => {
    const { title, content, userId } = req.body;
    try{
        const summaryContent = summary.map((item) => ({
            title: item.title,
            content: item.content,
            
        }));
    
        const newSummary = new Summaryy({
            userId,
            title,
            content: summaryContent
        });
        await newSummary.save();
        res.status(201).json({ summary: newSummary });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
});



Router.get('/get-summary', async (req, res) => {
    try {
        const summaries = await Summary.find();
        res.status(200).json({ summaries });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
});

Router.get("/get-summary/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const summary = await Summary.findById(id);
        res.status(200).json({ summary });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
});

Router.get('/get-summary-history/:userId', async (req, res) => {

    const { userId } = req.params;
    // console.log(userId);
    
    try {
        const summaries = await Summary.find({ userId });
        res.status(200).json({ summaries });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
});

Router.delete("/delete-summary", async (req, res) => {
    const { userId, summaryId } = req.body;
    try {
        const summary = await Summary.findById(summaryId);
        if (summary.userId !== userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await Summary.findByIdAndDelete(id);
        res.status(201).json({ message: "Summary deleted successfully" });
    }catch(err) {
        console.log(err);
        res.status(400).json({ err });
    }
});


export default Router;