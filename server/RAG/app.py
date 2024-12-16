from flask import Flask, request, jsonify
from query_data import qandr
from query_data import generate_neuron_quiz_items
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 
@app.route("/api/query", methods=["POST"])
def query():
    query = request.json["query"]
    print("Query received: ", query)
    response = qandr(query)
    
    return jsonify({"response": response})


@app.route("/api/quiz", methods=["POST"])
def quiz():
  
    query = request.json["query"]
    # print("Query received: ", query)
    response = generate_neuron_quiz_items(query)
    print(response)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)