from flask import jsonify
from dotenv import load_dotenv
from pathlib import Path
import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import cohere

load_dotenv()
cohere_api_key = os.environ['COHERE_API_KEY']

def generate_summary(chunks):
    cohere_client = cohere.Client(api_key=cohere_api_key)
    results = []
    for chunk in chunks:
        # Create the prompt for summarization
        prompt = f"""
        Provide a suitable heading and summary for the following text:
        
        {chunk}
        
        Format your response as:
        Heading: <Your Heading>
        Summary: <Your Summary>
        """
        # Generate the summary using Cohere
        response = cohere_client.generate(
            model='command-xlarge-nightly',
            prompt=prompt,
            max_tokens=500  # Adjust token limit for detailed summaries
        )
        
        # Parse the response to extract the heading and summary
        result_text = response.generations[0].text.strip()
        heading, summary = "", ""
        
        for line in result_text.splitlines():
            if line.lower().startswith("heading:"):
                heading = line.split(":", 1)[1].strip()
            elif line.lower().startswith("summary:"):
                summary = line.split(":", 1)[1].strip()

        # Append the results
        results.append({
            "heading": heading,
            "summary": summary
        })

        # Print intermediate results for debugging
        print({"heading": heading, "summary": summary})
    return results

def process_and_summarize_pdf(pdf_file_path):
    # Load the document
    loader = PyPDFLoader(pdf_file_path)
    documents = loader.load()

    # Split text
    print("Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,  # Increased chunk size
        chunk_overlap=200,  # Adjust overlap for better context
        add_start_index=True
    )
    chunks = text_splitter.split_documents(documents)
    results = generate_summary(chunks)
    
    return results


def summarize_large_text(text):

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,  # Cohere's token limit depends on the model
        chunk_overlap=200,  # Overlap to maintain context between chunks
        add_start_index=True
    )
    chunks = text_splitter.split_text(text)
    print(f"Split text into {len(chunks)} chunks.")
    print(chunks)
    results = generate_summary(chunks)

    return results