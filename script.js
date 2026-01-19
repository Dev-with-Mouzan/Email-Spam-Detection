// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements
const emailForm = document.getElementById('emailForm');
const emailTextarea = document.getElementById('emailText');
const charCounter = document.getElementById('charCounter');
const submitBtn = document.getElementById('submitBtn');
const resultsContent = document.getElementById('resultsContent');
const loadingOverlay = document.getElementById('loadingOverlay');

// Character Counter
emailTextarea.addEventListener('input', (e) => {
    const length = e.target.value.length;
    charCounter.textContent = `${length.toLocaleString()} / 10,000`;
    
    // Visual feedback when approaching limit
    if (length > 9000) {
        charCounter.style.color = '#fa709a';
    } else {
        charCounter.style.color = 'var(--text-muted)';
    }
});

// Form Submission
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailText = emailTextarea.value.trim();
    
    if (!emailText) {
        showError('Please enter email content to analyze');
        return;
    }
    
    await classifyEmail(emailText);
});

// Classify Email Function
async function classifyEmail(emailText) {
    // Show loading state
    showLoading(true);
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_text: emailText
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Classification failed');
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to connect to the server. Please ensure the FastAPI backend is running.');
    } finally {
        showLoading(false);
        submitBtn.disabled = false;
    }
}

// Display Results
function displayResults(data) {
    const { prediction, confidence, is_spam } = data;
    
    const confidencePercent = (confidence * 100).toFixed(1);
    
    const resultHTML = `
        <div class="result-display">
            <div class="result-badge ${is_spam ? 'spam' : 'ham'}">
                ${is_spam ? `
                    <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                ` : `
                    <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `}
                <span>${is_spam ? '🚨 SPAM DETECTED' : '✅ LEGITIMATE EMAIL'}</span>
            </div>
            
            <div class="confidence-section">
                <p class="confidence-label">Confidence Score</p>
                <div class="confidence-bar-container">
                    <div class="confidence-bar" style="width: ${confidencePercent}%"></div>
                </div>
                <p class="confidence-value">${confidencePercent}%</p>
            </div>
            
            <div class="result-message">
                <p>
                    ${is_spam 
                        ? `<strong>Warning:</strong> This email has been classified as spam with ${confidencePercent}% confidence. It may contain unwanted or malicious content. Exercise caution and avoid clicking any links or downloading attachments.`
                        : `<strong>Safe:</strong> This email appears to be legitimate with ${confidencePercent}% confidence. However, always verify the sender's identity and be cautious with sensitive information.`
                    }
                </p>
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = resultHTML;
}

// Show Error Message
function showError(message) {
    const errorHTML = `
        <div class="result-display">
            <div class="result-badge" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);">
                <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Error</span>
            </div>
            <div class="result-message">
                <p><strong>Error:</strong> ${message}</p>
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = errorHTML;
}

// Show/Hide Loading Overlay
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// Check API Health on Load
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'healthy' && data.model_loaded) {
            console.log('✅ API is healthy and model is loaded');
        } else {
            console.warn('⚠️ API health check failed:', data);
        }
    } catch (error) {
        console.warn('⚠️ Could not connect to API. Please ensure the FastAPI server is running on port 8000.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAPIHealth();
    console.log('🚀 Email Spam Detector initialized');
});
