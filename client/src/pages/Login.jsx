import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import "../assets/css/pages/login.css";
import { NewsContext } from '../context/NewsContext';

const Login = () => {
    const { setAuth, notifySuccess, notifyError, isAuthenticated, getCurrentUserID } = useContext(NewsContext);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })
    const { email, password } = inputs

    const onChangeInputs = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()

        try {
            const body = { email, password };

            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const parseRes = await response.json();
            if (parseRes.data.token) {
                localStorage.setItem("token", parseRes.data.token);
                localStorage.setItem("click_history", "");
                localStorage.setItem("impressions", "");
                setAuth(true);
                notifySuccess(parseRes.message);
                getCurrentUserID();
                navigate("/");
                window.location.reload();
            } else {
                notifyError("An error occurred while logging in.");
            }
        } catch (error) {
            console.error(error.message)
            notifyError("An error occurred while logging in.");
        }
    }

    return (
        <div id='login-page'>
            <div className='container'>
                <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                <h1>Sign In</h1>
                <form onSubmit={onSubmitForm} className='login-account-form'>
                    <input type="email" name='email' placeholder='Email Address*' required value={email} onChange={(e) => onChangeInputs(e)} />
                    <input type="password" name='password' placeholder='Password*' required value={password} onChange={(e) => onChangeInputs(e)} />
                    <button>Log In</button>
                </form>
                <div className='container-nav'>
                    <p>Forgot your password?</p>
                    <p onClick={() => navigate("/register")}>Don't have an account? register here</p>
                </div>
            </div>
        </div>
    )
}

export default Login