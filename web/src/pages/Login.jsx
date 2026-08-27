import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css'; // Add a CSS file for auth pages layout

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '', // PRN or Email
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.identifier || !formData.password) {
      setError("Please fill in both your PRN (or email) and password.");
      return;
    }

    setIsLoading(true);
    
    // Call the API service
    const response = await authService.login(formData);
    
    setIsLoading(false);

    if (response.success === false) {
      setError(response.message || "We couldn't log you in. Check your details and try again.");
    } else if (response.token) {
      // Store JWT exactly as Architecture.md / api.js expects
      localStorage.setItem('campx_token', response.token);
      
      // Also potentially store user data
      if (response.user) {
        localStorage.setItem('campx_user', JSON.stringify(response.user));
      }
      
      navigate('/');
    } else {
      // Fallback for mocked response where success might be true but no token (e.g. initial stub before backend exists)
      setError("Login endpoint is stubbed and didn't return a token. Note: Backend might not be running yet.");
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p className="caption">Log in to buy and sell on campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="identifier">PRN or Institutional Email</label>
            <input 
              type="text" 
              id="identifier" 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              autoFocus 
            />
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
          </div>

          {error && <div className="error-text auth-error">{error}</div>}

          <button type="submit" className="primary submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="caption">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
