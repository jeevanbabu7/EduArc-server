
import Together from "together-ai";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.DEEPSEEK_API_KEY);

const together = new Together({
    apiKey: process.env.DEEPSEEK_API_KEY
});
const deepSeekResponse = async (query, socket) => {
    const stream = await together.chat.completions.create({
        messages: [
            {
                role: "user",
                content: query
            }
        ],
        model: "deepseek-ai/deepseek-r1", 
        max_tokens: 500, 
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        stop: [],
        stream: true
    });
    let response = "";
    for await (const chunk of stream) {
        // socket.emit('model_response',chunk.choices[0]?.delta?.content || "");
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
        response += chunk.choices[0]?.delta?.content || "";
    }
    socket.emit('model_response',response);

    return response;
    
}

export default deepSeekResponse;

