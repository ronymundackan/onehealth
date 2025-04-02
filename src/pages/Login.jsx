import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // Make sure this path is correct

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  // Update state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);

      // Fetch user role
      const user = await axios.get('http://localhost:5000/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      localStorage.setItem('userRole', user.data.role); // Assuming user.data.role contains the role

      // Redirect based on role
      if (user.data.role === 'patient') {
        navigate('/user-dashboard');
      } else if (user.data.role === 'hospital') {
        navigate('/hospital-dashboard');
      } else if (user.data.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-override-container">
      <div className="login-override-form-container">
        <h2>Login to Your Account</h2>

        {error && <div className="login-override-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              className="login-override-input" // Use overriding input class
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              className="login-override-input" // Use overriding input class
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-links">
            <Link to="/forgot-password" className="login-override-link">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-override-button" // Use overriding button class
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-prompt">
          Don't have an account?{' '}
          <Link to="/signup" className="login-override-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};


export default Login;