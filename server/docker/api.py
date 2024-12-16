from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

# FastAPI app initialization
app = FastAPI()

# Define the input schema
class Prompt(BaseModel):
    question: str
# TensorFlow Serving URL
TF_SERVING_URL = "http://localhost:8501/v1/models/rag_model:predict"

@app.post("/clarify/")
async def clarify_doubt(prompt: Prompt):
    # Create the payload expected by TensorFlow Serving
    input_data = {
        "inputs": {
            "question": [prompt.question]
        }
    }

    # Send the request to TensorFlow Serving
    try:
        response = requests.post(TF_SERVING_URL, json=input_data)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error calling TF Serving: {e}")

    # Extract clarification from the response
    output = response.json()
    
    # Assuming the model returns the answer in `predictions` field
    clarification = output.get("predictions", [])[0]

    return {
        "clarification": clarification
    }

# Health check route
@app.get("/")
async def root():
    return {"message": "Quiz-based learning API with RAG is running."}