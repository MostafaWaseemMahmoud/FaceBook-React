import axios from 'axios';
import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({
        name: false,
        emailFormat: false,
        emailExists: false,
        password: false,
    });

    const handleInputChange = async (e) => {
        const { type, value } = e.target;
        let newErrors = { ...errors };

        if (type === "text") {
            setName(value);
            newErrors.name = value === "" || value.length < 3;
        } else if (type === "email") {
            setEmail(value);
            const emailExp = /\w+(\d+)?@gmail.com/;
            newErrors.emailFormat = value === "" || !value.match(emailExp);
            if (!newErrors.emailFormat) {
                try {
                    const res = await axios.get("http://localhost:5500/allusers");
                    newErrors.emailExists = res.data.some(user => user.email === value);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            }
        } else if (type === "password") {
            setPassword(value);
            newErrors.password = value === "";
        } else if (type === "file") {
            setImage(e.target.files[0]);
        }

        setErrors(newErrors);
    };

    const submitForm = async () => {
        if (Object.values(errors).some(error => error)) {
            console.log("Form contains errors.");
            return;
        }

        let formData = new FormData();
        formData.append("image", image);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        try {
            const response = await axios.post("http://localhost:5500/adduser", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("User added successfully:", response.data);
            window.localStorage.setItem("id", response.data._id);
            navigate("/profile/" + response.data._id)
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const GotoLink = () => {
        navigate('/login');
    }

    return (
        <div className="container">
            <div className="register">
                <div className="cont">
                    <div className="title">
                        <h1>Register Page</h1>
                    </div>
                    <div className="form">
                        <div className="field">
                            <input onChange={handleInputChange} type="text" placeholder="Enter Your Name" />
                            <br />
                            {errors.name && (
                                <span className="field-error valid">
                                    <i className="fas fa-exclamation-triangle"></i> Please Enter A Valid Name
                                </span>
                            )}
                        </div>
                        <div className="field">
                            <input onChange={handleInputChange} type="email" placeholder="Enter Your Email" />
                            <br />
                            {errors.emailFormat && (
                                <span className="field-error">
                                    <i className="fas fa-exclamation-triangle"></i> Please Enter A Valid Email
                                </span>
                            )}
                            <br />
                            {errors.emailExists && (
                                <span className="field-error exist">
                                    <i className="fas fa-exclamation-triangle"></i> This Email Is Already Exist
                                </span>
                            )}
                        </div>
                        <div className="field">
                            <input onChange={handleInputChange} type="password" placeholder="Enter Your Password" />
                            <br />
                            {errors.password && (
                                <span className="field-error">
                                    <i className="fas fa-exclamation-triangle"></i> Please Enter A Valid Password
                                </span>
                            )}
                        </div>
                        <div className="field">
                            <input onChange={handleInputChange} type="file" id="fileinput" />
                            <label htmlFor="fileinput"><i className="fa-solid fa-image"></i></label>
                        </div>
                        <button className='Btn' onClick={submitForm}>Submit Form</button>
                        <br />
                        <span onClick={GotoLink} className='login-link'>Already Have An Account</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
