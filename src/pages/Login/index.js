import React from "react"
import './index.css'
import { Link } from "react-router-dom"
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Navbar from "../../nav/Navbar";

const Login = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()

  const url = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${url}/login`, {email, password})
    .then( result => {
      console.log(result)
      if(result.data.message === "success"){
        const userName = result.data.userName; 
        const userId = result.data.userId;
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName); 

        const user = result.data.user || {};
        localStorage.setItem("profileImg", user.profileImg || "/assets/profile-blank.png");
        localStorage.setItem("description", user.description || "");
        localStorage.setItem("topic", user.topic || "");
        localStorage.setItem("post", JSON.stringify(user.post || []));

        navigate('/profile')
      } else {
        alert(result.data);
      }
    })
    .catch(err => console.log(err))
  }
    return(
      <div className="login-container">
        <div className='title-login'>
            <div className='line-login'>--</div>
            <div className='login'>LOG IN</div>
            <div className='line-login'>--</div>
        </div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group-login">
          <label className="email">Email :</label>
          <input
            type="email"
            name="email"
            placeholder="type your email"
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="form-group-login">
          <label className="password">Password :</label>
          <input
            type="password"
            name="password"
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="policy">
          I understood the <a href="/terms-and-policy">terms & policy</a>.
        </div>
        <div className="btn-container">
          <button type="submit" className="login-button">LOG IN</button>
        </div>
      </form>
      <div className="login-bottom">
        <div className="login-way-1">
            or sign in with
          </div>

          <img src="/assets/google.png"alt="" className="google-icon"/>

          <div className="login-way-2">
            Don't have an account? 
            <Link to="/register"><span> SIGN UP</span></Link>
          </div>
      </div>  
        <Navbar />
  </div>
    )
}

export default Login