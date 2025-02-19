import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Reset Password</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <Link className="link" to="/">Back to Login</Link>
      </div>
    </div>
  );
}
