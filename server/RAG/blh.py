from query_data import qandr
from query_data import generate_neuron_quiz_items
query="Provide information on neurons for quiz generation."
response=generate_neuron_quiz_items(query, 5)
print(response)