import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/server/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // "Login successful."

        // Redirect based on user role
        switch (result.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'hospital':
            navigate('/hospital-dashboard');
            break;
          case 'user':
            navigate('/user-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        alert(result.message); // "Invalid email or password."
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while logging in.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <div className='linkbox'>
          <div className='link1'>
            <Link className="link" to="/forgot-password">Forgot Password? </Link>
          </div>
          <div>
            <p>Don't have an Account?</p>
          </div>
          <div>
            <Link className="link" to="/signup">Sign Up</Link>
          </div>
        </div>      
      </div>
    </div>
  );
}