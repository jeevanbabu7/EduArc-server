from together import Together

client = Together(api_key="6bd0ecb5eea31e13b49acf03759fc24e8bbb4e71da4050fb41e00ba399c29685")

def Llama_stream(query, task="chat"):
    if task == "summarize":
        prompt = f"Summarize the following content:\n\n{query}"
    else:
        prompt = query

    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=None,
        temperature=0.7,
        top_p=0.7,
        top_k=50,
        repetition_penalty=1,
        stop=["<|eot_id|>","<|eom_id|>"],
        stream=True
    )
    for token in response:
        if hasattr(token, 'choices'):
            print(token.choices[0].delta.content, end='', flush=True)


