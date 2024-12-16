import React, { useState } from 'react';
import './Reg.css';
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdPassword, MdEmail } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

function Reg() {
  const [name, setName] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classi, setClassi] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle registration form submission
  async function handleReg(e) {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMsg('');
    setSuccessMsg('');

    // Simple front-end validation
    if (!email || !name || !createPassword || !confirmPassword || !classi) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (createPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    // Data to be sent to the backend
    const formData = {
      name,
      email,
      password: createPassword,
      class_: classi, // Ensuring this matches the backend's expected field
    };
console.log(formData);

    try {
      const response = await fetch('http://localhost:5000/api/user/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      
      
      const data = await response.json();
      

      if (response.status === 201) {
        setSuccessMsg('Registration successful!');
        setErrorMsg('');
      } else {
        setErrorMsg(data.message || 'Registration failed');
        setSuccessMsg('');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
      console.error('Error:', error);
      setSuccessMsg('');
    }
  }

  // Clear messages when close icon is clicked
  function handleMsg() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  return (
    <div className='outerdiv'>
      <div className='Reg'>
        <div className='maindiv'>
          <div className='leftdiv'>
            <h1 style={{ color: '#1a2a4e' }}>Register</h1>

            {/* Email Input */}
            <div className='inp'>
              <MdEmail className='user' />
              <input type='email' placeholder='Email' className='inp11' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Name (Username) Input */}
            <div className='inp'>
              <CiUser className='user' />
              <input type='text' placeholder='Name' className='inp11' value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Create Password Input */}
            <div className='inp'>
              <RiLockPasswordLine className='user' />
              <input type='password' placeholder='Create Password' className='inp11' value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
            </div>

            {/* Confirm Password Input */}
            <div className='inp'>
              <RiLockPasswordLine className='user' />
              <input type='password' placeholder='Confirm Password' className='inp11' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            {/* Class Input */}
            <div className='inp'>
              <MdPassword className='user' />
              <input type='text' placeholder='Class' className='inp11' value={classi} onChange={(e) => setClassi(e.target.value)} />
            </div>

            {/* Register Button */}
            <button className='btns' onClick={handleReg}>Register Now</button>
          </div>

          {/* Right Div for the Image */}
          <div className='rightdivv'>
            <img className='img1' alt='register' />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className='errordiv'>
          <p style={{ textAlign: 'center' }}>{errorMsg}</p>
          <RxCross2 className='cross' onClick={handleMsg} />
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className='successdiv'>
          <p style={{ textAlign: 'center' }}>{successMsg}</p>
          <RxCross2 className='cross' onClick={handleMsg} />
        </div>
      )}
    </div>
  );
}

export default Reg;
