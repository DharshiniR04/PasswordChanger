import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './passwordRecover.css';
import axios from 'axios';
import passwordRecoverImg from '../assets/passRecoverBackground.png';

function PasswordRecover() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthClass, setStrengthClass] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [userType, setUserType] = useState("user"); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /\d/.test(password);
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const specialCharCriteria = /[!@#$%^&*]/.test(password);

    const criteriaMet = [lengthCriteria, numberCriteria, uppercaseCriteria, lowercaseCriteria, specialCharCriteria].filter(Boolean).length;

    let strength = "";

    if (criteriaMet === 5) {
      strength = "Strong";
      setStrengthClass("Strong");
    } else if (criteriaMet >= 3) {
      strength = "Moderate";
      setStrengthClass("Moderate");
    } else {
      strength = "Weak";
      setStrengthClass("Weak");
    }
    
    setPassword(password);
    setPasswordStrength(strength);
  };

  const confirmPasswordMatch = (newPassword) => {
    setConfirmPassword(newPassword);
    if (newPassword !== password) {
      setConfirmMessage("Passwords don't match");
    } else {
      setConfirmMessage("Passwords match!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match. Please correct it.");
      return;
    }

    const data = {
      email: e.target.elements.email.value,
      password: password,
      userType: userType 
    };

    try {
      const response = await axios.patch("https://password-changer-server.vercel.app/api/passwordRecovery", data);
      if(response.data.message === "User Not Found") {
        alert("User Not Found");
        return;
      }
      else if(response.data.message==="Admin Not Found"){
        alert("Admin Not Found");
        return;
      }
      alert("Passwords changed successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="side">
        <img src={passwordRecoverImg} alt="passwordImg" />
      </div>
      <div className="password-recover">
        <div className="password-recover-container">
          <h1>Password Recovery</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Enter your email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />

            <label htmlFor="userType">Select User Type:</label>
            <select
              id="userType"
              name="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <label htmlFor="password">Enter Password:</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={(e) => checkPasswordStrength(e.target.value)}
                className="solid-input"
                placeholder="8-Characters"
                required
              />
              <span className="signup-password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p id="passwordStrength" className={strengthClass}>{passwordStrength}</p>

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="solid-input"
                placeholder="8-Characters"
                onChange={(e) => confirmPasswordMatch(e.target.value)}
                required
              />
              <span className="signup-password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p id="confirmPass" className={confirmMessage.includes("match") ? "success" : "error"}>{confirmMessage}</p>

            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecover;
