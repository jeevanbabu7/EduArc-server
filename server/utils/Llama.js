// import LlamaAI from 'llamaai';

import { get } from "mongoose";


// const apiToken = 'LA-7c7052c673e7455780b7e20874f6f73b9beeee0bbad04f64a0a66e7cd04fd68b';
// const llamaAPI = new LlamaAI(apiToken);

// Build the Request
// const apiRequestJson = {
//     "messages": [
//         {"role": "user", "content": "Explain Newton's Laws of Motion."}
//     ],
//     "functions": [
//         {
//             "name": "explain_topic",
//             "description": "Provide an explanation of a given educational topic",
//             "parameters": {
//                 "type": "object",
//                 "properties": {
//                     "topic": {
//                         "type": "string",
//                         "description": "The topic to explain, e.g., Newton's Laws of Motion"
//                     },
//                     "grade_level": {
//                         "type": "string",
//                         "enum": ["elementary", "middle_school", "high_school", "college"],
//                         "description": "The academic level of the explanation"
//                     }
//                 },
//                 "required": ["topic", "grade_level"]
//             }
//         }
//     ],
//     "stream": false,
//     "function_call": "explain_topic"
// }


// const apiRequestJson = {
//     "messages": [
//         {"role": "user", "content": "What is the weather like in Boston?"},
//     ],
//     "functions": [
//         {
//             "name": "get_current_weather",
//             "description": "Get the current weather in a given location",
//             "parameters": {
//                 "type": "object",
//                 "properties": {
//                     "location": {
//                         "type": "string",
//                         "description": "The city and state, e.g. San Francisco, CA",
//                     },
//                     "days": {
//                         "type": "number",
//                         "description": "for how many days ahead you wants the forecast",
//                     },
//                     "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
//                 },
//             },
//             "required": ["location", "days"],
//         }
//     ],
//     "stream": false,
//     "function_call": "get_current_weather",
//    };
 
// // Execute the Request
// llamaAPI.run(apiRequestJson)
//     .then(response => {
//         console.log("hiii");
        
//     console.log(response);
    
//     })
//     .catch(error => {
//     // Handle errors
//     console.log(error);
    
//     });
 

const LLAMA_API_URL = 'https://api.llama-api.com/chat/completions';

export const getLlamaCompletion = async () => {
    const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer LA-7c7052c673e7455780b7e20874f6f73b9beeee0bbad04f64a0a66e7cd04fd68b`,
        "Access-Control-Allow-Origin": "*"
    };

    try {
        const response = await fetch(LLAMA_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({
                messages: [{role: "user", content: "Explain Newton's Laws of Motion."}],
            })
        });

        const data = await response.json();
        console.log(data);
        
    }
    catch(err) {
        console.log(err);
    }
}

getLlamaCompletion().then(data => console.log(data));