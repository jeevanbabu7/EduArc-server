import whisper
import subprocess

def extract_audio_from_video(video_url, output_file):
    # Use yt-dlp to stream audio and pipe it to ffmpeg for extraction
    command = [
        "yt-dlp", "-f", "bestaudio", "-o", "-", video_url,
        "|", "ffmpeg", "-i", "pipe:0", "-vn", "-acodec", "mp3", output_file
    ]

    # Execute the command
    process = subprocess.run(" ".join(command), shell=True)
    
    if process.returncode == 0:
        print(f"Audio extracted successfully to {output_file}")
        return output_file
    else:
        print("Failed to extract audio.")
    



def transcribe_audio(audio_file):
    
    model = whisper.load_model("base")

    # Transcribe the audio
    result = model.transcribe(audio_file)

    # Print the transcription
    # print("Transcription:\n", result["text"])

    return result["text"]

# Example usage

def extract_text_from_pdf(pdf_file):
    text = ""
    with pdfplumber.open(io.BytesIO(pdf_file.read())) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()