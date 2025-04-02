from flask import Flask, request, jsonify
from query_data import qandr
from query_data import generate_quiz_items
from query_data import query_specific_collection
from flask_cors import CORS
from create_database import add_to_chroma
from create_database import download_file
from summarizer import process_and_summarize_pdf
from utils import extract_audio_from_video
from summarizer import summarize_large_text
from transcription import transcribe_audio
from query_data import query_specific_collection

app = Flask(__name__)
CORS(app) 
@app.route("/api/query", methods=["POST"])
def query():
    query = request.json["query"]
    print("Query received: ", query)
    response = qandr(query)
    
    return jsonify({"answer": response})


@app.route("/api/quiz", methods=["POST"])
def quiz():
    print("Quiz request received.")
    pdf_url = request.json["pdf_url"]
    file_path  = download_file(pdf_url)
    response = generate_quiz_items(file_path)
    print(response)
    return jsonify({"response": response})

@app.route("/api/summary/pdf", methods=["POST"])
def summary():
    print("Summary request received.")
    pdf_url = request.json["pdf_url"]
    file_path  = download_file(pdf_url)
    summary = process_and_summarize_pdf(file_path)
    if(summary == None):
        return jsonify({"ok": False, "response": "Error occurred during summary"})
    return jsonify({"ok": True, "response": summary})

@app.route("/api/summary/video", methods=["POST"])
def video_summary():
    try:
        print("Video Summary request received.")
        video_url = request.json["video_url"]
        output_file_name = request.json["output_file_name"]
        output_file = f'data/audios/{output_file_name}.mp3'
        
        extract_audio_from_video(video_url, output_file)
        audio_text = transcribe_audio(output_file)
        summary = summarize_large_text(audio_text)
        # print('/n/n' , audio_text , '/n/n')
        return jsonify({"ok": True, "response": summary})
    except Exception as e:
        # print(e)
        return jsonify({"ok": False, "response": "Error occurred during audio processing."})
    

@app.route('/api/query-collection', methods=['POST'])
def query_collection():
    try:
        file_id = request.json["file_id"]
        query = request.json["query"]
        print(f"Query received for collection {file_id}: {query}")
        
        response = query_specific_collection(query, file_id)
        return jsonify({"ok": True, "answer": response})
    except Exception as e:
        print(f"Error querying collection: {str(e)}")
        return jsonify({"ok": False, "answer": f"Error processing query: {str(e)}"})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    file_link = request.json["file_link"]
    file_id = request.json["file_id"]
    try:
        # Download the file and add it to Chroma database with file_id as name
        file_path = download_file(file_link)
        add_to_chroma(file_path, collection_name=file_id, persist_directory="chroma/")
        return jsonify({"ok": True, "response": f"File added to database with ID: {file_id}"})
    except Exception as e:
        print(f"Error creating Chroma database: {str(e)}")
        return jsonify({"ok": False, "response": f"Error creating database: {str(e)}"})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
