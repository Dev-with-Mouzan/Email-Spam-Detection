# 📧 Email Spam Detector

A modern, AI-powered email spam classification system built with FastAPI backend and a stunning glassmorphism frontend.

![Email Spam Detector](https://img.shields.io/badge/ML-Spam%20Detection-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)

## ✨ Features

- 🤖 **Machine Learning Powered** - Uses trained ML model for accurate spam detection
- ⚡ **Fast & Efficient** - FastAPI backend for lightning-fast predictions
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- 📊 **Confidence Scores** - Shows prediction confidence percentage
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔒 **Privacy First** - All processing happens on your local machine

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Email_Spam/Frontend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the FastAPI backend**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at: `http://localhost:8000`

2. **Open the frontend**
   
   Simply open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click → Open with → Your preferred browser
   - Or use a local server:
     ```bash
     python -m http.server 3000
     ```
     Then visit: `http://localhost:3000`

## 📖 Usage

1. **Enter Email Content**: Paste the email text you want to analyze into the textarea
2. **Click Analyze**: Press the "Analyze Email" button
3. **View Results**: See the classification result (Spam/Ham) with confidence score

### Example Email Texts to Test

**Spam Example:**
```
CONGRATULATIONS! You've won $1,000,000! Click here NOW to claim your prize!
Limited time offer! Act fast! Send your bank details to claim@winner.com
```

**Ham Example:**
```
Hi John, I hope this email finds you well. I wanted to follow up on our meeting
yesterday regarding the project timeline. Could we schedule a call next week?
Best regards, Sarah
```

## 🛠️ API Documentation

### Endpoints

#### `GET /`
Root endpoint with API information
```json
{
  "message": "Email Spam Classifier API",
  "status": "active",
  "endpoints": {
    "health": "/health",
    "predict": "/predict",
    "docs": "/docs"
  }
}
```

#### `GET /health`
Health check endpoint
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

#### `POST /predict`
Classify email as spam or ham

**Request Body:**
```json
{
  "email_text": "Your email content here..."
}
```

**Response:**
```json
{
  "prediction": "spam",
  "confidence": 0.95,
  "is_spam": true
}
```

### Interactive API Docs

FastAPI provides automatic interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
Email_Spam/Frontend/
├── main.py                          # FastAPI backend application
├── spam_email_detector_model.pkl    # Trained ML model
├── requirements.txt                 # Python dependencies
├── index.html                       # Frontend HTML
├── style.css                        # Styling with glassmorphism
├── script.js                        # Frontend JavaScript
└── README.md                        # This file
```

## 🎨 Design Features

- **Glassmorphism Effects** - Modern frosted glass aesthetic
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Micro-interactions for better UX
- **Dark Theme** - Easy on the eyes
- **Responsive Layout** - Adapts to all screen sizes
- **Custom Icons** - SVG icons for crisp display

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Install dependencies: `pip install -r requirements.txt`

**Problem**: `FileNotFoundError: spam_email_detector_model.pkl`
- **Solution**: Ensure the model file is in the same directory as `main.py`

**Problem**: Port 8000 already in use
- **Solution**: Change the port in `main.py` or kill the process using port 8000

### Frontend Issues

**Problem**: "Failed to connect to the server"
- **Solution**: Ensure the FastAPI backend is running on `http://localhost:8000`

**Problem**: CORS errors in browser console
- **Solution**: The backend already has CORS enabled. Make sure you're accessing the frontend via a proper URL (not `file://`)

## 🧪 Testing the API

Using curl:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"email_text": "Congratulations! You won $1000000!"}'
```

Using Python:
```python
import requests

response = requests.post(
    "http://localhost:8000/predict",
    json={"email_text": "Click here to claim your prize!"}
)
print(response.json())
```

## 📊 Model Information

The application uses a pre-trained machine learning model (`spam_email_detector_model.pkl`) that classifies emails as:
- **Spam**: Unwanted or malicious emails
- **Ham**: Legitimate emails

The model provides confidence scores to indicate prediction certainty.

## 🚀 Deployment

### Local Network Access

To make the API accessible on your local network:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Then access from other devices using your computer's IP address:
`http://YOUR_IP_ADDRESS:8000`

### Production Deployment

For production deployment, consider:
- Using a production ASGI server (Gunicorn + Uvicorn)
- Setting up proper CORS origins (not `*`)
- Adding authentication if needed
- Using HTTPS
- Deploying to cloud platforms (AWS, GCP, Azure, Heroku)

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Styled with modern CSS techniques
- Icons from custom SVG designs

---

**Made with ❤️ using FastAPI and Machine Learning**
