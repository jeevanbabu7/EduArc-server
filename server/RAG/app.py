from flask import Flask, request, jsonify
from query_data import qandr
from query_data import generate_quiz_items
from flask_cors import CORS
from create_database import add_to_chroma
from create_database import download_file
from summarizer import process_and_summarize_pdf
from utils import extract_audio_from_video
from summarizer import summarize_large_text
from transcription import transcribe_audio

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
    query = request.json["query"]
    print("Query received: ", query)
    response = generate_quiz_items(query)
    print(response)
    return jsonify({"response": response})

@app.route("/api/summary/pdf", methods=["POST"])
def summary():
    print("Summary request received.")
    pdf_url = request.json["pdf_url"]
    file_path  = download_file(pdf_url)
    summary = process_and_summarize_pdf(file_path)
    return jsonify({"response": summary})

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
    

@app.route('/api/upload', methods=['POST'])
def upload_file():
    file_link = request.json["file_link"]
    add_to_chroma(file_link)
    return jsonify({"response": "File added to database."})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
