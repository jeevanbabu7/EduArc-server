import argparse
# from dataclasses import dataclass
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import CohereEmbeddings
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
import os
from cohere import Client
from dotenv import load_dotenv

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
    embedding_function = CohereEmbeddings(cohere_api_key=cohere_api_key)
    
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






        
    
def generate_neuron_quiz_items(query_text, num_questions = 1):
    PROMPT_TEMPLATE = """
    Based on the following context related to neurons, generate a multiple-choice question with four options. Also, specify the correct answer:

    Context:
    {context}

    ---

    Generate the following:
    1. A question related to neurons based on the above context.
    2. Four multiple-choice options labeled (A), (B), (C), (D).
    3. Indicate the correct option from the four choices.

    Study the context carefully and provide the required output.
    """
    cohere_api_key = os.environ['COHERE_API_KEY']  # Ensure COHERE_API_KEY is in .env
    embedding_function = CohereEmbeddings(cohere_api_key=cohere_api_key)
    
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    quiz_items = []

    for _ in range(num_questions):
  
        results = db.similarity_search_with_relevance_scores(query_text, k=4)
        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
        
        # Create prompt with the context
        prompt = PROMPT_TEMPLATE.format(context=context_text)
        

        cohere_client = Client(cohere_api_key)  
        response = cohere_client.generate(
            prompt=prompt, 
            max_tokens=300, 
            temperature=0.5
        )
        
        response_text = response.generations[0].text

        # Parsing the response to extract question, options, and answer
        # Assuming the response format is consistent
        # This is just a placeholder parsing; you'll need to adjust based on the actual response format
        question, options, answer = parse_response(response_text)
        

        quiz_item = {
            "question": question,
            "options": options,
            "ans": answer
        }
        
        quiz_items.append(quiz_item)

    return quiz_items

def parse_response(response_text):
    # Example parsing logic - Adjust this based on the actual format of response_text
    lines = response_text.strip().split('\n')
    print(lines)
    question = lines[2]
    options = [
        lines[3],
        lines[4],
        lines[5],
        lines[6]
    ]
    answer = lines[8].strip()  # Assuming the answer is on the 6th line
    
    return question, options, answer
