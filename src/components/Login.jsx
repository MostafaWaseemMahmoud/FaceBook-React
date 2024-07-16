import axios from 'axios';
import React, { createRef, useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const passwordField = createRef();
    const emailError = createRef();
    const passwordFieldError = createRef();
    const [email, setEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userId, setUserId] = useState('');

    const handleInputChange = async (e) => {
        const inputValue = e.target.value;
        setEmail(inputValue);

        if (inputValue.length === 0 || !inputValue.match(/\w+(\d+)?@gmail.com/)) {
            emailError.current.classList.add("block");
            return;
        } else {
            emailError.current.classList.remove("block");
        }

        try {
            const res = await axios.get("http://localhost:5500/allusers");
            let emailExists = false;

            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].email === inputValue) {
                    emailExists = true;
                    setUserPassword(res.data[i].password); // Corrected here
                    setUserId(res.data[i]._id); // Corrected here
                    break;
                }
            }

            if (emailExists) {
                emailError.current.classList.remove("block");
            } else {
                setUserPassword('');
                setUserId('');
                emailError.current.classList.add("block");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const submitForm = () => {
        if (passwordField.current.value === userPassword) {
            window.localStorage.setItem("id", userId);
            passwordFieldError.current.classList.remove("block");
            navigate('/'); // Navigate to dashboard or any other page after successful login
        } else {
            passwordFieldError.current.classList.add("block");
        }
    };

    const navigateRegister = () => {
        navigate("/register");
    };

    return (
        <div className="container">
            <div className="register">
                <div className="cont">
                    <div className="title">
                        <h1>Login Page</h1>
                    </div>
                    <div className="form">
                        <div className="field">
                            <input
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={handleInputChange}
                            />
                            <br />
                            <br />
                            <span className="field-error exist" ref={emailError}>
                                <i className="fas fa-exclamation-triangle"></i>No User With This Email
                            </span>
                        </div>
                        <div className="field">
                            <input ref={passwordField} type="password" placeholder="Enter Your Password" />
                            <br />
                            <span className="field-error">
                                <i className="fas fa-exclamation-triangle"></i> Please Enter A Valid Password
                            </span>
                            <br />
                            <span className="field-error" ref={passwordFieldError}>
                                <i className="fas fa-exclamation-triangle"></i> Wrong Password
                            </span>
                        </div>
                        <button className='Btn' onClick={submitForm}>Submit Form</button>
                        <br />
                        <br />
                        <span onClick={navigateRegister} className='login-link'>New Here: Create Account</span>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
