from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import pickle
import logging
from pathlib import Path
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Email Spam Classifier API",
    description="ML-powered email spam detection service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class EmailRequest(BaseModel):
    email_text: str = Field(..., min_length=1, max_length=10000, description="Email content to classify")

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    is_spam: bool

# Global variable for model
model = None

@app.on_event("startup")
async def load_model():
    """Load the ML model on startup"""
    global model
    try:
        model_path = Path(__file__).parent / "spam_email_detector_model.pkl"
        
        # Try loading with pickle first
        try:
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            logger.info("Model loaded successfully with pickle!")
        except Exception as pickle_error:
            logger.warning(f"Pickle load failed: {pickle_error}")
            logger.info("Trying with joblib...")
            
            # Try with joblib as fallback
            try:
                import joblib
                model = joblib.load(model_path)
                logger.info("Model loaded successfully with joblib!")
            except Exception as joblib_error:
                logger.error(f"Joblib load also failed: {joblib_error}")
                raise Exception(f"Could not load model with pickle or joblib. Pickle error: {pickle_error}, Joblib error: {joblib_error}")
                
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        logger.error("Please ensure the model file is a valid pickle or joblib file")
        raise

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Email Spam Classifier API",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_spam(request: EmailRequest):
    """
    Predict if an email is spam or ham
    
    Args:
        request: EmailRequest containing email text
        
    Returns:
        PredictionResponse with prediction, confidence, and spam flag
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Make prediction
        email_text = request.email_text.strip()
        
        # Get prediction and probability
        prediction = model.predict([email_text])[0]
        
        # Get probability scores
        try:
            probabilities = model.predict_proba([email_text])[0]
            # Assuming binary classification: [ham_prob, spam_prob]
            confidence = float(max(probabilities))
        except AttributeError:
            # If model doesn't have predict_proba, use default confidence
            confidence = 0.95
        
        # Determine if spam (prediction could be 0/1 or 'ham'/'spam')
        is_spam = prediction in [1, 'spam', 'Spam', 'SPAM']
        prediction_label = "spam" if is_spam else "ham"
        
        logger.info(f"Prediction: {prediction_label}, Confidence: {confidence:.2f}")
        
        return PredictionResponse(
            prediction=prediction_label,
            confidence=confidence,
            is_spam=is_spam
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
