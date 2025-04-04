import argparse
# from dataclasses import dataclass
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
# Replace the deprecated import with the new one
from langchain_cohere import CohereEmbeddings
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import os
from cohere import Client
from dotenv import load_dotenv
from together import Together
import json
import requests
from flask import jsonify
from dotenv import load_dotenv
import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import cohere

load_dotenv()

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
answer the question based on the following context
:

{context}

---

study the above context and answer the following question: {question}
"""


def qandr(query_text):
    

    # Prepare the DB.
    #embedding_function = OpenAIEmbeddings()
    #db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    cohere_api_key = os.environ['COHERE_API_KEY']  # Ensure COHERE_API_KEY is in .env
    # Update to include the required model parameter
    embedding_function = CohereEmbeddings(
        cohere_api_key=cohere_api_key,
        model="embed-english-v3.0"  # Specify the embedding model
    )
    
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(query_text, k=4)
   # if len(results) == 0 or results[0][1] < 0.7:
    #    print(f"Unable to find matching results.")
     #   return

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    print(prompt)

   # model = ChatOpenAI()
   # response_text = model.predict(prompt)

    from cohere import Client

    cohere_api_key = os.getenv('COHERE_API_KEY')
    cohere_client = Client(cohere_api_key)

    response = cohere_client.generate(
        prompt=prompt, 
        max_tokens=300, 
        temperature=0.5
    )
    response_text = response.generations[0].text

    return response_text

def query_specific_collection(query_text, collection_name):
    """
    Query a specific collection in the Chroma database.
    
    Args:
        query_text: The query to search for
        collection_name: The name of the collection to search in
    
    Returns:
        The response text from the model
    """
    # Initialize the embedding function
    cohere_api_key = os.environ['COHERE_API_KEY']
    embedding_function = CohereEmbeddings(
        cohere_api_key=cohere_api_key,
        model="embed-english-v3.0"
    )
    
    # Access the specific collection with the correct directory structure
    persist_directory = os.path.join(CHROMA_PATH, collection_name)
    
    # Debugging info
    print(f"Accessing Chroma collection at: {persist_directory}")
    
    # Access the collection
    db = Chroma(
        persist_directory=persist_directory,
        embedding_function=embedding_function,
        collection_name=collection_name
    )

    # Search the DB
    results = db.similarity_search_with_relevance_scores(query_text, k=4)
    
    # If no relevant results found
    if len(results) == 0:
        return "No relevant information found in the document about this query."
    
    # Check if the highest relevance score is too low
    if results[0][1] < 0.5:  # Using a threshold of 0.5, adjust as needed
        return "The document does not contain sufficient information about this topic."

    # Format context from search results
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    
    # Create improved prompt that emphasizes relevance checking
    RELEVANCE_PROMPT_TEMPLATE = """
    Based on the following context from a document:

    {context}

    ---

    Answer the following question: {question}
    
    Important: If the context does not contain relevant information to answer the question, 
    respond with "The document does not contain information about this topic." 
    Do not make up information or provide answers from general knowledge if the context 
    doesn't support it.
    """
    
    prompt_template = ChatPromptTemplate.from_template(RELEVANCE_PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    
    # Generate response using Cohere
    cohere_client = Client(api_key=cohere_api_key)
    
    response = cohere_client.generate(
        prompt=prompt, 
        max_tokens=300, 
        temperature=0.5
    )
    response_text = response.generations[0].text

    return response_text

def generate_quiz_items(pdf_file_path):
    loader = PyPDFLoader(pdf_file_path)
    documents = loader.load()

    # Split text into chunks
    print("Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=200,
        add_start_index=True
    )
    chunks = text_splitter.split_documents(documents)
    
    quiz_items = []
    
    # Process each chunk and generate quiz questions
    for chunk in chunks:
        try:
            # Make API call to the ngrok endpoint
            response = requests.post(
                "https://ae53-35-247-188-130.ngrok-free.app/quiz",
                json={"context": chunk.page_content},
                headers={"Content-Type": "application/json"}
            )

            
            # Check if the request was successful
            if response.status_code == 200:
                # Add the generated quiz items to our collection
                quiz_data = response.json()
                quiz_items.append(quiz_data)
                print(quiz_data)
                print(f"Generated quiz item from chunk {len(quiz_items)}")
            else:
                print(f"Failed to generate quiz for chunk: {response.status_code}, {response.text}")
        except Exception as e:
            print(f"Error generating quiz for chunk: {str(e)}")
    
    print(f"Generated {len(quiz_items)} quiz items in total")
    return quiz_items

def parse_response(response_text):
    # Example parsing logic - Adjust this based on the actual format of response_text
    lines = response_text.strip().split('\n')
    print(lines)
    question = lines[0]
    options = [
        lines[1],
        lines[2],
        lines[3],
        lines[4]
    ]
    answer = lines[4].strip() 
    return  question, options, answer

def generate_summary(query_text):

    PROMPT_TEMPLATE = """
    Based on the following context, generate a concise summary of the content:

    Context:
    {context}

    ---
    
    Generate a brief summary that encapsulates the main ideas of the above context.
    """
    
    # Load API key
    cohere_api_key = os.environ['COHERE_API_KEY']  # Ensure COHERE_API_KEY is set in your environment
    
    # Format the prompt with the query_text directly
    prompt = PROMPT_TEMPLATE.format(context=query_text)
    
    # Generate summary using Cohere
    cohere_client = Client(cohere_api_key)
    response = cohere_client.generate(
        model="command",  # Use an appropriate model
        prompt=prompt,
        max_tokens=300,
        temperature=0.5
    )
    
    response_text = response.generations[0].text.strip()
    print(response_text)  # Optional: For debugging or checking the output
    
    return [response_text]  # Return the summary in a list (as before)

