import React, { useState } from 'react';
import axios from 'axios';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../App.css'
const apiUrl=import.meta.env.VITE_API_BACKEN_URL

const UploadForm = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  const handleFrontChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontImage(file);
      setPreviewFront(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleBackChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackImage(file);
      setPreviewBack(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontImage || !backImage) {
      setError('Please upload both images.');
      return;
    }

    const formData = new FormData();
    formData.append('front', frontImage);
    formData.append('back', backImage);

    try {
      setLoading(true); 
      setError(null);
      const res = await axios.post(`${apiUrl}/api/ocr/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(res.data.data
      );
      
      setOcrResult(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Error processing OCR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFrontImage(null);
    setBackImage(null);
    setPreviewFront(null);
    setPreviewBack(null);
    setOcrResult(null);
    setError(null);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <header className="upload-header">
          <h1>Aadhaar Card OCR Extraction</h1>
          <p>Upload both sides of your Aadhaar card to extract information</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-sections">
            <div className="upload-section">
              <div className="section-header">
                <h3>Front Side</h3>
                <span className="required">*</span>
              </div>
              <div className="upload-area">
                <label htmlFor="front-upload" className="upload-label">
                  {previewFront ? (
                    <div className="preview-container">
                      <img src={previewFront} alt="Front Preview" className="preview-image" />
                      <div className="replace-overlay">
                        <span>Replace Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="placeholder">
                      <div className="upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                      </div>
                      <p>Click to upload front side</p>
                      <span className="file-types">JPG, PNG or PDF</span>
                    </div>
                  )}
                  <input
                    id="front-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFrontChange}
                    className="file-input"
                  />
                </label>
              </div>
            </div>

            <div className="upload-section">
              <div className="section-header">
                <h3>Back Side</h3>
                <span className="required">*</span>
              </div>
              <div className="upload-area">
                <label htmlFor="back-upload" className="upload-label">
                  {previewBack ? (
                    <div className="preview-container">
                      <img src={previewBack} alt="Back Preview" className="preview-image" />
                      <div className="replace-overlay">
                        <span>Replace Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="placeholder">
                      <div className="upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                      </div>
                      <p>Click to upload back side</p>
                      <span className="file-types">JPG, PNG or PDF</span>
                    </div>
                  )}
                  <input
                    id="back-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBackChange}
                    className="file-input"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={clearForm} 
              className="btn-secondary"
              disabled={loading}
            >
              Clear
            </button>
            <button 
              type="submit" 
              disabled={loading || !frontImage || !backImage}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Extract Information'
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="processing-overlay">
            <div className="processing-content">
              <div className="lottie-animation">
                <DotLottieReact
                  src="https://lottie.host/867656e2-d923-4629-b14f-9f054dba3a13/lYNDPq8tgP.lottie"
                  loop
                  autoplay
                />
              </div>
              <p>Processing your Aadhaar images...</p>
            </div>
          </div>
        )}

   


{ocrResult && (

    <div className="aadhaar-details-card">
      <div className="card-header">
        <div className="header-icon">
          <i className="fas fa-id-card"></i>
        </div>
        <h2>Aadhaar Details</h2>
      </div>
      
      <div className="card-body">
        <div className="detail-row">
          <div className="detail-icon">
            <i className="fas fa-fingerprint"></i>
          </div>
          <div className="detail-content">
            <div className="detail-label">Aadhaar Number</div>
            <div className="detail-value aadhaar-number">{ocrResult.aadhaarNumber}</div>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-icon">
            <i className="fas fa-user"></i>
          </div>
          <div className="detail-content">
            <div className="detail-label">Full Name</div>
            <div className="detail-value">{ocrResult.name}</div>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="detail-content">
            <div className="detail-label">Date of Birth</div>
            <div className="detail-value">{ocrResult.dob}</div>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-icon">
            <i className="fas fa-venus-mars"></i>
          </div>
          <div className="detail-content">
            <div className="detail-label">Gender</div>
            <div className="detail-value">{ocrResult.gender}</div>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="detail-content">
            <div className="detail-label">Address</div>
            <div className="detail-value">{ocrResult.address}</div>
          </div>
        </div>
        
        <div className="success-message">
          <div className="success-icon">
            <i className="fas fa-check"></i>
          </div>
          <span>Information extracted successfully!</span>
        </div>
        
      </div>
    </div>

)}


      </div>
    </div>
  );
};

export default UploadForm;