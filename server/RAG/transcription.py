import whisper
import subprocess
import os
from pathlib import Path

def extract_audio_from_youtube(video_url, output_file):
   
    output_dir = Path(output_file).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    # Use yt-dlp to stream audio and pipe it to ffmpeg for extraction
    command = [
        "yt-dlp", "-f", "bestaudio", "-o", "-", video_url,
        "|", "ffmpeg", "-i", "pipe:0", "-vn", "-acodec", "mp3", output_file
    ]

    
    process = subprocess.run(" ".join(command), shell=True)
    
    if process.returncode == 0:
        print(f"Audio extracted successfully to {output_file}")
    else:
        print("Failed to extract audio.")

def transcribe_audio(audio_file):
    # Load Whisper model
    model = whisper.load_model("base")

    # Transcribe the audio
    result = model.transcribe(audio_file)


    # Print the transcription
    print("Transcription:\n", result["text"])

    return result["text"]

# Example usage
