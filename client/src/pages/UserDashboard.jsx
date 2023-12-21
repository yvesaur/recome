import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../api/Fetch';
import '../assets/css/pages/userdashboard.css';
import SelectCategory from '../components/SelectCategory';
import Loader from '../components/animation/Loader';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import UserPreferenceModal from '../components/modal/UserPreferenceModal';
import { NewsContext } from '../context/NewsContext';

const UserDashboard = () => {
    const { isAuthenticated, isAuth, getUserClick, formatDate } = useContext(NewsContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [currentUserID, setCurrentUserID] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [interestAreas, setInterestAreas] = useState([]);
    const [wideInterest, setWideInterest] = useState(true);
    const [topicExclusions, setTopicExclusions] = useState([]);
    const [isTrendingNews, setIsTrendingNews] = useState("");
    const [userClickedNews, setUserClickedNews] = useState([]);

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
            setInterestAreas(parseRes.data.interest_areas)
            setWideInterest(parseRes.data.wide_interest)
            setTopicExclusions(parseRes.data.topic_exclusions)
            setIsTrendingNews(parseRes.data.trending_news)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [])

    useEffect(() => {
        isAuth();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get(`/getClickHistory/${currentUserID}`);
                console.log("USER CLICKED NEWS: ", response.data.data.userClickedNews);
                setUserClickedNews(response.data.data.userClickedNews);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [currentUserID]);


    console.log("USER CLICKED NEWS", userClickedNews)

    const openDialog = () => {
        setIsDialogOpen(true)
    };

    const closeDialog = () => {
        setIsDialogOpen(false)
    }

    const handleNewsSelect = async (id) => {
        try {
            navigate(`/news/${id}`);
            const response = await Fetch.get((`/news/${id}`))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='user-dashboard'>
            <Header isAuthenticated={isAuthenticated} />
            <SelectCategory />
            <div id='user-information'>
                <div>
                    <i class="fa-regular fa-user user-pfp"></i>
                    <div>
                        <p className='user-fullname'>{currentUserInfo.firstname} {currentUserInfo.lastname}</p>
                        <p><b>username:</b> {currentUserInfo.username}</p>
                        <p><b>email:</b> {currentUserInfo.email}</p>
                    </div>
                </div>
                <div>
                    <label for="preferences-btn">Edit Preferences</label>
                    <i onClick={openDialog} id='preferences-btn' class="fa-solid fa-sliders"></i>
                </div>
            </div>
            <div id='user-browsed-news'>
                <div className='browsed-news-banner'>
                    <p>RECENTLY VISITED NEWS</p>
                </div>
            </div>
            <div className='clicked-news-container'>
                {userClickedNews.length > 0 ? (
                    userClickedNews.map((news) => {
                        return (
                            <div className='news-card all-news clicked-news-card' key={news.id} onClick={() => {
                                getUserClick(news.id);
                                handleNewsSelect(news.id);
                            }}>
                                <img src={news.img_url} alt="NEWS THUMBNAIL" />
                                <p className='news-category'>{news.category}</p>
                                <p className='news-title'>{news.title}</p>
                                <div>
                                    <p className='news-author'>{news.author}</p>
                                    <p className='news-date'>{formatDate(news.date)}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <Loader />
                )
                }

            </div>
            <UserPreferenceModal
                currentUserID={currentUserID}
                isDialogOpen={isDialogOpen}
                closeDialog={closeDialog}
                interestAreas={interestAreas}
                wideInterest={wideInterest}
                topicExclusions={topicExclusions}
                isTrendingNews={isTrendingNews}
                setWideInterest={setWideInterest}
                setIsTrendingNews={setIsTrendingNews}
                setInterestAreas={setInterestAreas}
                setTopicExclusions={setTopicExclusions}
            />
            <Footer />
        </div>
    )
}

export default UserDashboard