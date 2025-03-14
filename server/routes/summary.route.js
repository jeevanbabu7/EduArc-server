import express from 'express'

const Router = express.Router();

Router.post('/new-summary', async (req, res) => {
    const { heading, summary } = req.body;
    try{
        const summaryContent = summary.map((item) => ({
            title: item.heading,
            content: item.summary
        }));
    
        const newSummary = new Summary({
            heading,
            summary: summaryContent
        });
        await newSummary.save();
        res.status(201).json({ summary: newSummary });
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }



});

export default Router;