import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../api/Fetch';
import "../../assets/css/layout/header.css";
import { NewsContext } from '../../context/NewsContext';
import SelectNewsCategory from '../SelectNewsCategory';

const Header = ({ setSearch, isDisabled }) => {
    const { isAuthenticated, setAuth, notifySuccess, currentUserID, setCurrentUserID } = useContext(NewsContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");

    async function getUserInfo() {
        try {
            const response = await Fetch.get("/getuserinfo", {
                headers: {
                    token: localStorage.token
                }
            })

            setName(response.data.data.username)
            setCurrentUserID(response.data.data.userid)

        } catch (error) {
            console.error(error.message)
        }
    }

    const logout = async (e) => {
        e.preventDefault()

        let clickHistory = localStorage.getItem("click_history") || "";
        let impressions = localStorage.getItem("impressions") || "";
        console.log("CLICK HISTORY: ", clickHistory)
        console.log("IMPRESSIONS: ", impressions)

        if (clickHistory.trim() !== "" && impressions.trim() !== "") {
            const response = await Fetch.post(`/addBehaviour/${currentUserID}`, {
                click_history: clickHistory.trim(),
                impressions: impressions.trim(),
            }, {
                headers: { "Content-Type": "application/json" }
            })
        }

        localStorage.removeItem("token")
        localStorage.removeItem("click_history")
        localStorage.removeItem("impressions")
        setAuth(false)
        notifySuccess("Logged Out Successfully.")
        setCurrentUserID(null)
        navigate("/")
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    // console.log("HEADER isAuthenticated: ", isAuthenticated)

    const debouncedSearch = useCallback(
        debounce((search) => {
            setSearch(search);
        }, 500),
        []
    );

    const handleSearch = (event) => {
        debouncedSearch(event.target.value);
    };

    return (
        <>

            <div id='header'>

                <input
                    className={`search-news ${isDisabled ? 'search-disable' : ''}`}
                    type="search"
                    name="searchNews"
                    id="searchNews"
                    placeholder='search'
                    onChange={(e) => handleSearch(e)}
                />
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
            {/* <SelectNewsCategory></SelectNewsCategory> */}
        </>
    )
}

export default Header