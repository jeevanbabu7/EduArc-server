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
from together import Together
import json

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

def generate_quiz_items(query_text, num_questions=1):
    PROMPT_TEMPLATE = """
    Generate a flashcard with the following structure:
    - **Question:** A multiple-choice question.
    - **Options:** 4 choices (A, B, C, D).
    - **Correct Answer:** One correct answer.
    - **Explanation:** A detailed explanation of why the answer is correct.

    Example output:
    {{
        "question": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correct_answer": "Paris",
        "explanation": "Paris is the capital of France, known for the Eiffel Tower."
    }}

    Generate a similar flashcard for the topic: {context}.
    """
    client = Together(api_key=os.environ["TOGETHER_API_KEY"]) 
    prompt = PROMPT_TEMPLATE.format(context=query_text)
    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.6
        )

        # Correct way to access response content
        response_text = response.choices[0].message.content  # Use .content instead of ['content']
        
        # Remove markdown formatting and parse directly
        cleaned_response = response_text.replace("```json", "").replace("```", "").strip()
        
        # Parse JSON directly
        # quiz_item = json.loads(cleaned_response)
        # quiz_items.append(quiz_item)

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {response_text}")
    except KeyError as e:
        print(f"Key error: {e}")
    
    return response_text



    
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

