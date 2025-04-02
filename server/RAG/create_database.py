# from langchain.document_loaders import DirectoryLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
# from langchain.embeddings import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
# Replace the deprecated import
from langchain_cohere import CohereEmbeddings
import cohere
from langchain_community.vectorstores import Chroma
import openai 
from dotenv import load_dotenv
import os
import shutil
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote
import requests

# Load environment variables. Assumes that project contains .env file with API keys
load_dotenv()
#---- Set OpenAI API key 
# Change environment variable name from "OPENAI_API_KEY" to the name given in 
# your .env file.
#openai.api_key = os.environ['OPENAI_API_KEY']
cohere_api_key = os.environ['COHERE_API_KEY']

CHROMA_PATH = "chroma"
DATA_PATH = "data/books"


def download_file(url, save_dir=DATA_PATH):
    print(f"Downloading file from {url}...")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        # Try to get the filename from the Content-Disposition header
        content_disposition = response.headers.get('Content-Disposition')
        if content_disposition:
            if "filename*" in content_disposition:
                # Extract and decode the filename*
                filename = content_disposition.split("filename*=")[-1].strip()
                if filename.startswith("utf-8''"):
                    filename = unquote(filename.split("utf-8''")[-1])
            elif "filename=" in content_disposition:
                # Fallback to filename= if present
                filename = content_disposition.split("filename=")[-1].strip('"')
            else:
                filename = "downloaded_file"  # Fallback if no filename is found
        else:
            # Fallback to extracting from URL
            parsed_url = urlparse(url)
            filename = Path(parsed_url.path).name  # Extract file name
            filename = unquote(filename).split("?")[0]  # Remove query parameters

        # Ensure directory exists
        Path(save_dir).mkdir(parents=True, exist_ok=True)
        
        # Full file path
        file_path = Path(save_dir) / filename
        if(file_path.exists()):
            print(f"File already exists: {file_path}")
            return file_path

        # Save the file in chunks
        with open(file_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)

        print(f"File downloaded: {file_path}")
        return file_path
    else:
        raise Exception(f"Failed to download file: HTTP {response.status_code}")

def main():
    generate_data_store()
    # add_to_chroma()

# TO use all the PDFs in the data folder
def generate_data_store():
    documents = load_documents()
    chunks = split_text(documents)
    save_to_chroma(chunks)

def add_to_chroma(file_path, collection_name=None, persist_directory=CHROMA_PATH):
    """
    Creates a Chroma database from a PDF file.
    
    Args:
        file_path: Path to the PDF file
        collection_name: Optional name for the collection (defaults to None)
        persist_directory: Directory to store the Chroma database
    
    Returns:
        The path to the Chroma database
    """
    if isinstance(file_path, str) and file_path.startswith(('http://', 'https://')):
        # If file_path is a URL, download it first
        file_path = download_file(file_path)
    
    # Load the document
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # Split the text
    chunks = split_text(documents)
    
    # Create database folder if it doesn't exist
    os.makedirs(persist_directory, exist_ok=True)
    
    # Use specific collection path if provided
    collection_path = os.path.join(persist_directory, collection_name) if collection_name else persist_directory
    
    # Clear out any existing database with the same collection name
    if os.path.exists(collection_path) and collection_name:
        shutil.rmtree(collection_path)
    
    # Create a new DB from the documents
    # Fix the model parameter error by adding the required model parameter
    embeddings = CohereEmbeddings(
        cohere_api_key=cohere_api_key,
        model="embed-english-v3.0",  # Specify a valid model
        client=None
    )
    
    db = Chroma.from_documents(
        chunks, 
        embeddings, 
        persist_directory=collection_path,
        collection_name=collection_name
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {collection_path}.")
    
    return collection_path

def load_document(cloud_link):
    # Ensure data directory exists
    Path(DATA_PATH).mkdir(parents=True, exist_ok=True)
    
    local_file_path = download_file(cloud_link)
    
    # Load the document
    loader = PyPDFLoader(local_file_path)
    documents = loader.load()
    return documents

def load_documents():
    loader = DirectoryLoader(DATA_PATH, glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    return documents


def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    # Print a sample chunk only if there are enough chunks
    if chunks and len(chunks) > 0:
        # Get the first chunk or a safe index
        sample_index = min(10, len(chunks) - 1)
        document = chunks[sample_index]
        print(f"Sample chunk (index {sample_index}):")
        print(document.page_content)
        print(document.metadata)

    return chunks


def save_to_chroma(chunks: list[Document]):
    # Clear out the database first.
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    # Create a new DB from the documents.
    # Update this instance too with the required model parameter
    embeddings = CohereEmbeddings(
        cohere_api_key=cohere_api_key,
        model="embed-english-v3.0",  # Specify a valid model
        client=None
    )
    
    db = Chroma.from_documents(
        chunks, embeddings, persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")


if __name__ == "__main__":
    main()
