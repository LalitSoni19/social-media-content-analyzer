import os  

from dotenv import load_dotenv 
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
import pytesseract 
from PIL import Image
import requests
from transformers import AutoTokenizer
load_dotenv()  

app = Flask(__name__)
CORS(app)

tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")

# API_URL = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")  
API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"  

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}


def analyze_text_with_huggingface(text):
    payload = {"inputs": text}
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()  
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Hugging Face API error: {e}")  # Log the error
        return {"error": "Failed to analyze text with Hugging Face API."}
    except Exception as e:
        print(f"An unexpected error occure{e}")
        return {"error":"An unexpected error occur."}
# def analyze_text_with_huggingface(text):
#     inputs = tokenizer(text, return_tensors="pt")
#     payload = {"inputs": inputs.to(json)}
#     try:
#         response = requests.post(API_URL, headers=headers, json=payload)
#         response.raise_for_status()
#         result = response.json()
#         sentiment_label = result['label']
#         sentiment_score = result['score']
#         return {'label': sentiment_label, 'score': sentiment_score}
#     except requests.exceptions.HTTPError as e:
#         if e.response.status_code == 429:
#             # Implement retry mechanism (not shown here)
#             return {"error": "Rate limit exceeded. Please try again later."}
#         else:
#             return {"error": f"Hugging Face API error: {e}"}

@app.route('/')
def index():
    return jsonify({'message': 'Flask server is running!'})

@app.route('/api/analyze', methods=['POST'])
def analyze_file():
    print("Received files:", request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            text = ""
            if file.filename.endswith('.pdf'):
                with fitz.open(stream=file.read(), filetype="pdf") as doc:
                    for page in doc:
                        text += page.get_text()
                # doc = fitz.open(stream=file.read(), filetype="pdf")
                # for page in doc:
                #     text += page.get_text()
                # doc.close()

            elif file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
                image = Image.open(file)
                text = pytesseract.image_to_string(image)
            else:
                return jsonify({'error': 'Unsupported file type'}), 400

            # Analyze the extracted text using Hugging Face
            analysis_results = analyze_text_with_huggingface(text)
            if "error" in analysis_results:
              return jsonify({'error':analysis_results["error"]}),500

            return jsonify({'extracted_text': text, 'analysis': analysis_results}), 200

        except fitz.FileDataError:
            return jsonify({'error': 'Invalid PDF file'}), 400
        except pytesseract.TesseractError:
            return jsonify({'error': 'Error during OCR processing.  Is Tesseract installed correctly?'}), 500
        except Exception as e:
             return jsonify({'error': str(e)}), 500
            # print(f"An unexpected error occurred: {e}") # Log for debugging
            # return jsonify({'error': 'An unexpected error occurred'}), 500

    return jsonify({'error': 'Something went wrong'}), 500


if __name__ == '__main__':
    app.run(debug=True)