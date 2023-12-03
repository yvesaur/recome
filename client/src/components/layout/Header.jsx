import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/layout/header.css";
import { NewsContext } from '../../context/NewsContext';

const Header = () => {
    const { isAuthenticated, setAuth, notifySuccess } = useContext(NewsContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [currentUserID, setCurrentUserID] = useState(null)

    async function getName() {
        try {
            const response = await fetch("http://localhost:5000/api/v1/getuserinfo", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json()
            console.log(parseRes)
            setName(parseRes.data.username)
            setCurrentUserID(parseRes.data.userid)

        } catch (error) {
            console.error(error.message)
        }
    }

    const logout = async (e) => {
        e.preventDefault()
        let clickHistory = localStorage.getItem("click_history");
        let impressions = localStorage.getItem("impressions");
        console.log("CLICK HISTORY: ", clickHistory)
        console.log("IMPRESSIONS: ", impressions)

        const response = await fetch(`http://localhost:5000/api/v1/addBehaviour/${currentUserID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                click_history: clickHistory,
                impressions: impressions,
            }),
        });

        localStorage.removeItem("token")
        localStorage.removeItem("click_history")
        localStorage.removeItem("impressions")
        setAuth(false)
        notifySuccess("Logged Out Successfully.")
        // window.location.reload(false);
    }

    useEffect(() => {
        getName();
    }, [])

    // console.log("HEADER isAuthenticated: ", isAuthenticated)

    return (
        <div id='header'>
            <input className='search-news' type="search" name="searchNews" id="searchNews" placeholder='search' />
            <img onClick={() => navigate("/")} src={require("../../assets/img/recome-light.png")} alt="Recome Logo Icon" />
            {isAuthenticated ? (
                <div className='logged-user'>
                    {/* Your logged user content */}

                    <i className="fa-solid fa-user" style={{ color: "#fefffe" }}></i>
                    <h4>Hi, {name}</h4>
                    <i class="fa-solid fa-gear" onClick={() => navigate(`/user/${currentUserID}/dashboard`)} style={{ color: "#fefffe" }}></i>
                    <i onClick={(e) => logout(e)} class="fa-solid fa-arrow-right-from-bracket" style={{ color: "#fefffe" }}></i>
                </div>
            ) : (
                <div className='register-guest'>
                    <p onClick={() => navigate("/login")}>Log In</p>
                    <button onClick={() => navigate("/register")}>Sign Up</button>
                </div>
            )}
        </div>
    )
}

export default Header