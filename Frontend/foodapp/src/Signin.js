import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailcheck, setEmailCheck] = useState(false);
  const [userOtp, setUserOtp] = useState(""); 
  const [sentOtp, setSentOtp] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [enterOtpBox, setEnterOtpBox] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setEmail(e.target.value);
  }

  const otpChangeHandler = (e) => {
    setUserOtp(e.target.value); 
  }

  const loginHandler = (e) => {
    e.preventDefault();

    if (userOtp !== sentOtp) {
      setError("Incorrect OTP");
      setSuccess("");
    } else {
      setError("");
      navigate("/home");
    }
  }

  const checkEmailExisted = async () => {
    try {
      const res = await axios.get("http://localhost:4000/credentials");
      const existed = res.data.filter(item => item.email === email);
      return existed.length > 0; // Returns true if email exists
    } catch (error) {
      console.error("Error checking email:", error);
      setError("Error checking email. Please try again.");
      return false;
    }
  }
  
  const sendOtp = async () => {
    const emailExists = await checkEmailExisted();

    if (emailExists) {
      try {
        setEnterOtpBox(true);
        const response = await axios.post("http://localhost:4000/credentials/send-otp", { email });
        localStorage.setItem("userEmail", email);
        console.log("OTP sent:", response.data.otp);
        setSentOtp(response.data.otp); 
        setError("");
        setSuccess("OTP sent to email");
      } catch (error) {
        console.error("Error sending OTP:", error);
        setError("Failed to send OTP. Please try again.");
        setSuccess("");
      }
    } else {
      setError( 
      <span>
        Email does not exist. Click here to  <Link to="/signup">sign up</Link>
      </span>);
      setSuccess("");
    }
  }

  return (
    <div className='signin-div'>
      <h1 className='signin-heading'>Signin Form</h1>
      <form className='signin-form' onSubmit={loginHandler}>
        <label>
          <strong>Email ID</strong>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={changeHandler}
            required
          />
        </label>

        <label>
          {email && <button type="button" onClick={sendOtp}>Send OTP</button>}
        </label>

        {enterOtpBox && (
          <>
            <label>
              <strong>Enter OTP</strong>
              <input
                type="text"
                placeholder="Enter OTP"
                value={userOtp}
                onChange={otpChangeHandler}
                required
              />
            </label>
            <input type="submit" value="Login" /><br /><br />
          </>
        )}

        {error && <p className='error-message'>{error}</p>}
        {success && <p className='success-message'>{success}</p>}
      </form>
    </div>
  );
}

export default Signup;
