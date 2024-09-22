import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { Link } from 'react-router-dom';
import { getData } from "./functions";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const changeHandler = (e) => {
    setEmail(e.target.value);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSuccess("");
      const res = await getData();
      const exists = res.some(item => item.email === email);

      if (exists) {
        setError("Account already exists with this email");
      } else {
        await axios.post("http://localhost:4000/credentials", { email });
        console.log("Email posted successfully");
        setError("");
        setSuccess("Registrarion completed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className='signup-div'>
      <h1 className='signup-heading'>Signup Form</h1>
      <form className='signup-form' onSubmit={submitHandler}>
        <label>
          <strong>Email id </strong>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={changeHandler}
          />
        </label>
       

        <input type="submit" /><br/><br/>
        <label>
          <strong className='account-exist'>Already have an account? Click here to <Link to="/signin">Signin</Link></strong>
        </label>

        {error && <p className='error-message'>{error}</p> } 
        {success && <p className='success-message'>Registration completed . <Link to="/signin">Signin</Link></p> }
      </form>
    </div>
  );
}

export default Signup;
