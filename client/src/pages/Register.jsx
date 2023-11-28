import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/pages/register.css";
import { NewsContext } from '../context/NewsContext';

const Register = () => {
    const { setAuth, notifySuccess, notifyError, isAuthenticated } = useContext(NewsContext);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        interest_areas: ["sports", "technology", "music"],
        wide_interest: true,
        topic_exclusions: ["politics"],
        trending_news: "sports"
    })
    const { username, firstName, lastName, email, password, interest_areas, wide_interest, topic_exclusions, trending_news } = inputs

    const onChangeInputs = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()

        try {
            const body = { username, firstName, lastName, email, password, interest_areas, wide_interest, topic_exclusions, trending_news };

            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const parseRes = await response.json();
            if (parseRes.data.token) {
                localStorage.setItem("token", parseRes.data.token)
                setAuth(true);
                notifySuccess(parseRes.message);
            } else {
                notifyError("An error occurred while registering your account.");
            }
        } catch (error) {
            console.error(error.message)
            notifyError("An error occurred while registering your account.");
        }
    }

    return (
        <div id='register-page' className=''>
            <div onSubmit={(e) => {
                onSubmitForm(e);
                navigate("/")
            }} className='container'>
                <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                <h1>Register</h1>
                <form className='register-account-form'>
                    <input type="text" name='firstName' placeholder='First Name' value={firstName} onChange={(e) => onChangeInputs(e)} />
                    <input type="text" name='lastName' placeholder='Last Name' value={lastName} onChange={(e) => onChangeInputs(e)} />
                    <input type="email" name='email' placeholder='Email Address*' required value={email} onChange={(e) => onChangeInputs(e)} />
                    <input type="text" name='username' placeholder='User Name*' required value={username} onChange={(e) => onChangeInputs(e)} />
                    <input type="password" name='password' placeholder='Password*' required value={password} onChange={(e) => onChangeInputs(e)} />
                    <button>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Register