import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    prn: '',
    branch: '',
    year: '',
    mobile: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear field-specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "We need your full name to verify you.";
    if (!formData.prn.trim()) newErrors.prn = "Your PRN is required for access.";
    if (!formData.branch.trim()) newErrors.branch = "Please tell us your branch.";
    if (!formData.year.trim()) newErrors.year = "Please select or type your current year.";
    if (!formData.mobile.trim()) newErrors.mobile = "A mobile number helps buyers/sellers reach you.";
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = "We need a valid institutional email.";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Your password should be at least 6 characters long.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    // Call the API service
    const response = await authService.signup(formData);
    
    setIsLoading(false);

    if (response.success === false) {
      setApiError(response.message || "We couldn't register you. Please check your details and try again.");
    } else {
      // Assuming signup logs in the user automatically, or we can redirect to login
      if (response.token) {
        localStorage.setItem('campx_token', response.token);
        if (response.user) localStorage.setItem('campx_user', JSON.stringify(response.user));
        navigate('/');
      } else {
        // If no token returned, just send to login
        navigate('/login');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card signup-card">
        <div className="auth-header">
          <h2>Create an account</h2>
          <p className="caption">Join the verified campus marketplace.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              autoFocus 
            />
            {errors.fullName && <div className="error-text">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="prn">University PRN (Roll Number)</label>
            <input 
              type="text" 
              id="prn" 
              name="prn" 
              className="mono"
              value={formData.prn} 
              onChange={handleChange} 
            />
            {errors.prn && <div className="error-text">{errors.prn}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="branch">Branch</label>
              <input 
                type="text" 
                id="branch" 
                name="branch" 
                value={formData.branch} 
                onChange={handleChange} 
              />
              {errors.branch && <div className="error-text">{errors.branch}</div>}
            </div>

            <div className="form-group half">
              <label htmlFor="year">Year</label>
              <input 
                type="text" 
                id="year" 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
              />
              {errors.year && <div className="error-text">{errors.year}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input 
              type="tel" 
              id="mobile" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
            />
            {errors.mobile && <div className="error-text">{errors.mobile}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Institutional Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          {apiError && <div className="error-text auth-error">{apiError}</div>}

          <button type="submit" className="primary submit-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="caption">
            Already verified? <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
