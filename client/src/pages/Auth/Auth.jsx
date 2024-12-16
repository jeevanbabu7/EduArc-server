import React, { useState } from 'react';
import './auth.css';
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle login form submission
  async function handleAuth(e) {
    e.preventDefault();

    // Simple front-end validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Data to send to the backend
    const formData = { email, password };

    try {
      const response = await fetch('http://localhost:5173/api/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        setError('');  // Clear any error
        setSuccess('Login successful!');  // Mock successful login message
      } else {
        setError(data.message || 'An error occurred');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to connect to the server');
      setSuccess('');
    }
  }

  // Clear the error message when the close icon is clicked
  function handleMsg() {
    setError('');
    setSuccess('');
  }

  return (
    <div className="login">
      <div className="maindiv">
        <div className="leftdiv">
          <h1>Login</h1>

          {/* Email Input */}
          <div className="inp">
            <CiUser className="user" />
            <input
              type="email"
              placeholder="Email"
              className="inp11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="inp">
            <RiLockPasswordLine className="user" />
            <input
              type="password"
              placeholder="Password"
              className="inp11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button className="btns" onClick={handleAuth}>Login Now</button>
        </div>

        {/* Right Div for the Image */}
        <div className="rightdiv"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="errordiv">
          <p>{error}</p>
          <RxCross2 className="cross" onClick={handleMsg} />
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="successdiv">
          <p>{success}</p>
          <RxCross2 className="cross" onClick={handleMsg} />
        </div>
      )}
    </div>
  );
}

export default Auth;
