from flask import jsonify
from dotenv import load_dotenv
import os
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import cohere

# Load API Key from environment
load_dotenv()
cohere_api_key = os.environ['COHERE_API_KEY']

def generate_summary(chunks):
    cohere_client = cohere.Client(api_key=cohere_api_key)
    results = []
    for chunk in chunks:
        # Create the prompt for summarization
        user_message = f"""
        Provide a suitable heading and summary for the following text:
        
        {chunk}
        
        Format your response as:
        Title: <Your Title>
        Content: <Your Content>
        """

        # Ensure chunk is a string (for safety)
        chunk = str(chunk)

        # Use the correct API call format
        response = cohere_client.chat(
            model="command-r",  # Ensure this model supports the chat endpoint
            message=user_message,
            max_tokens=500
        )

        # Extract the generated text
        result_text = response.text.strip()

        # Parse the response to extract the heading and summary
        heading, summary = "", ""
        for line in result_text.splitlines():
            if line.lower().startswith("title:"):
                heading = line.split(":", 1)[1].strip()
            elif line.lower().startswith("content:"):
                summary = line.split(":", 1)[1].strip()

        # Append the results
        results.append({
            "title": heading,
            "content": summary
        })

        # Print intermediate results for debugging
        print({"title": heading, "content": summary})
        
    # combined_summary = " ".join([result["content"] for result in results])
    # title = generate_combined_title(cohere_client, combined_summary)
    # print(title)
    return results


def generate_combined_title(cohere_client, combined_summary):
    # Create a prompt for title generation
    title_prompt = f"""
    Generate a concise and engaging title for the following summarized content:

    {combined_summary}

    Format: Title: <Your Title>
    """

    # Call the Cohere API for title generation
    title_response = cohere_client.chat(
        model="command-r",
        message=title_prompt,
        max_tokens=100
    )
    print(title_response)
    # Extract the title from the response
    title_text = title_response.text.strip()
    title = ""
    for line in title_text.splitlines():
        if line.lower().startswith("title:"):
            title = line.split(":", 1)[1].strip()

    print(f"Generated Title: {title}")
    return title

def process_and_summarize_pdf(pdf_file_path):
    # Load the PDF
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

    # Generate summaries
    results = generate_summary(chunks)

    return results
def summarize_large_text(text):
    # Split large text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=200,
        add_start_index=True
    )
    chunks = text_splitter.split_text(text)
    print(f"Split text into {len(chunks)} chunks.")
    

    # Generate summaries
    results = generate_summary(chunks)

    return results
