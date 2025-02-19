# Social Media Content Analyzer

## Overview

This project is a web application that analyzes social media content drafts, providing users with insights and suggestions to improve engagement.  Users can upload PDF or image files containing their draft posts, and the application extracts the text, performs sentiment analysis (and potentially other NLP tasks), and displays the results.

## Technologies Used

*   **Frontend:**
    *   React (with Create React App)
    *   Material-UI (for UI components)
    *   `react-dropzone` (for drag-and-drop file upload)
*   **Backend:**
    *   Python (with Flask)
    *   `PyMuPDF` (for PDF parsing)
    *   `Tesseract OCR` (for image text extraction)
    *   `Hugging Face Transformers` (for AI/ML analysis, specifically sentiment analysis via the Inference API)
    *   `Flask-CORS` (for handling Cross-Origin Resource Sharing)
    *   `python-dotenv` (for managing environment variables)
    *   `requests` (for making HTTP requests)
* **Deployment:**
    *   Vercel

## Features

*   **Document Upload:** Supports PDF and image (PNG, JPG, JPEG, TIFF, BMP, GIF) uploads via drag-and-drop or a file picker.
*   **Text Extraction:**
    *   PDF Parsing: Extracts text from PDFs while preserving formatting using `PyMuPDF`.
    *   OCR: Extracts text from images using `Tesseract OCR`.
*   **AI/ML Analysis:** Performs sentiment analysis using the Hugging Face Inference API (default model: `cardiffnlp/twitter-roberta-base-sentiment-latest`).
*   **Error Handling:** Includes robust error handling for file uploads, text extraction, and API calls.
*   **Loading States:** Displays loading indicators during processing.
*   **User-Friendly Interface:** Uses Material-UI for a clean and responsive design.

## Project Structure
social-media-content-analyzer/
├── frontend/            
│   ├── node_modules/    
│   ├── public/
│   ├── src/             
│   │   └── App.js        
│   ├── package.json      
│   └── ...
├── backend/              
│   ├── app.py           
│   ├── requirements.txt  
│   └── .env              
└── README.md     

## Setup Instructions

**Prerequisites:**

*   Node.js and npm (or yarn) installed
*   Python 3.7+ installed
*   Tesseract OCR installed and added to your system's PATH 
*   A Hugging Face account and API key (free tier available)

**1. Clone the Repository:**

```bash
git clone <your_repository_url>  
cd social-media-content-analyzer

**2. Install Frontend Dependencies:**
cd frontend
npm install
cd ..

3. Install Backend Dependencies:
cd backend
pip install -r requirements.txt
cd ..


4. Install Tesseract OCR (System-Level):
Download the installer from the Tesseract GitHub repository (https://github.com/UB-Mannheim/tesseract/wiki) and ensure Tesseract is added to your system's PATH during installation.
Verify Tesseract Installation:  Open a new terminal and run tesseract --version. You should see version information.

5. Set up Hugging Face API Key:

Create a .env file in the backend directory.
Add your Hugging Face API key to the .env file:
HUGGINGFACE_API_KEY=your_api_key_here


6. Run the Application (Development):
Start Backend:
cd backend
python app.py

Start Frontend (in a separate terminal):
cd ../frontend
npm start

Open your browser and go to http://localhost:3000.


