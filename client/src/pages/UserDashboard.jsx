import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/pages/userdashboard.css';
import SelectCategory from '../components/SelectCategory';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import { NewsContext } from '../context/NewsContext';

const UserDashboard = () => {
    const { isAuthenticated, setAuth, notifySuccess } = useContext(NewsContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [currentUserID, setCurrentUserID] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState([]);

    async function getUserInfo() {
        try {
            const response = await fetch("http://localhost:5000/api/v1/getuserinfo", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json()
            // console.log(parseRes)
            setName(parseRes.data.username)
            setCurrentUserID(parseRes.data.userid)
            setCurrentUserInfo(parseRes.data)

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
                impressions: impressions.trim(),
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
        getUserInfo();
    }, [])
    return (
        <div id='user-dashboard'>
            <Header isAuthenticated={isAuthenticated} />
            <SelectCategory />
            <div id='user-information'>
                <div>
                    <i class="fa-regular fa-user fa-5x"></i>
                    <div>
                        <p className='user-fullname'>{currentUserInfo.firstname} {currentUserInfo.lastname}</p>
                        <p><b>username:</b> {currentUserInfo.username}</p>
                        <p><b>email:</b> {currentUserInfo.email}</p>
                    </div>
                </div>
                <div>
                    <label for="preferences-btn">Edit Preferences</label>
                    <i id='preferences-btn' class="fa-solid fa-sliders"></i>
                </div>
            </div>
            <div id='user-browsed-news'>
                <div className='browsed-news-banner'>
                    <p>RECENTLY VISITED NEWS</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UserDashboard