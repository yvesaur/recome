import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../api/Fetch';
import "../assets/css/newslist.css";
import { NewsContext } from '../context/NewsContext';
import Loader from './animation/Loader';

const NewsList = ({ title, description, isRecommended, isTrending, isLatest, search }) => {
    const navigate = useNavigate();
    const { latestNews, trendingNews, getUserClick, trendingNewsClicks, currentUserID, formatDate } = useContext(NewsContext);
    const [userRecommendedNews, setUserRecommendedNews] = useState([]);

    const [interestAreas, setInterestAreas] = useState([]);
    const [wideInterest, setWideInterest] = useState(true);
    const [topicExclusions, setTopicExclusions] = useState([]);
    const [isTrendingNews, setIsTrendingNews] = useState("not important");
    const [wideInterestNews, setWideInterestNews] = useState([]);
    const [userTrendingNews, setUserTrendingNews] = useState([]);

    async function getUserInfo() {
        try {
            const response = await Fetch.get("/getuserinfo", {
                headers: {
                    token: localStorage.token
                }
            })

            setInterestAreas(response.data.data.interest_areas)
            setWideInterest(response.data.data.wide_interest)
            setTopicExclusions(response.data.data.topic_exclusions)
            setIsTrendingNews(response.data.data.trending_news)

            if (wideInterest) {
                const response1 = await Fetch.get("/fetch/wideNews")
                setWideInterestNews(response1.data.data.news)
            }

        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getUserInfo();
    }, [])


    useEffect(() => {
        const filterUserTrendingNews = async () => {
            if (isTrendingNews.toLowerCase() === "important") {
                const ids = trendingNews.map(news => news.id);
                const userRecommendedNewsIds = userRecommendedNews.map(news => news.id);
                const filteredIds = ids.filter(id => userRecommendedNewsIds.includes(id));
                const filteredUserRecommendedNews = userRecommendedNews.filter(news => filteredIds.includes(news.id));
                setUserTrendingNews(filteredUserRecommendedNews)
            }
        }
        filterUserTrendingNews()
    }, [isTrendingNews, trendingNews, userRecommendedNews])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get(`/news/relatedusernews/${currentUserID}`)
                console.log("USER RECOMMENDED NEWS: ", response)
                setUserRecommendedNews(response.data.data.news)
            } catch (error) {
                console.error(error.message)
            }
        }
        fetchData();
    }, [])

    const handleNewsSelect = (id) => {
        try {
            navigate(`/news/${id}`)
        } catch (error) {
            console.log(error);
        }
    }

    const filteredLatestNews = useMemo(() => {
        return latestNews.filter((news) => {
            return search.toLowerCase() === '' ? news : news.title.toLowerCase().includes(search);
        });
    }, [latestNews, search]);

    const filteredTrendingNews = useMemo(() => {
        return trendingNews.filter((news) => {
            return search.toLowerCase() === '' ? news : news.title.toLowerCase().includes(search);
        });
    }, [trendingNews, search]);

    const filteredUserRecommendedNews = useMemo(() => {
        return userRecommendedNews.filter((news) => {
            const titleLower = news.title.toLowerCase();
            const searchLower = search.toLowerCase();
            const isExcludedKeyword = topicExclusions.some(keyword => titleLower.includes(keyword));
            const isIncludedCategory = interestAreas.includes(news.category);
            return !isExcludedKeyword && isIncludedCategory && (searchLower === '' ? news : titleLower.includes(searchLower));
        });
    }, [userRecommendedNews, search, topicExclusions, interestAreas]);

    return (
        <div id='news-list'>
            <div className='news-list-header'>
                <div>
                    <h1>{title}</h1>
                    <p>{description}
                    </p>
                </div>
            </div>

            {isRecommended & isTrendingNews.toLowerCase() === "important" ? (
                userTrendingNews.length > 0 ? (
                    <>
                        <h2 className='user-trending-recommendations-banner'>Current Trending News in your recommendation</h2>

                        <div className='news-list-container-user'>
                            {userTrendingNews.map((news) => {
                                return (
                                    <div className="news-list-card" key={news.id} onClick={() => {
                                        getUserClick(news.id);
                                        handleNewsSelect(news.id);
                                    }}>
                                        <img className='recommendedNews-img' src={news.img_url} alt="NEWS THUMBNAIL" />
                                        <p className='news-list-info news-category'>{news.category}</p>
                                        <p className='news-list-info news-title'>{news.title}</p>
                                        <div>
                                            <p className='news-author'>{news.author}</p>
                                            <p className='news-date'>{formatDate(news.date)}</p>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </>
                ) : (
                    null
                )
            ) : null}
            <div className='news-list-container news-list-container-main'>
                {isLatest ? (
                    filteredLatestNews.length > 0 ? (
                        filteredLatestNews.map((news) => {
                            return (
                                <div className="news-list-card" key={news.id} onClick={() => {
                                    getUserClick(news.id);
                                    handleNewsSelect(news.id);
                                }}>
                                    <img className='latestNews-img' src={news.img_url} alt="NEWS THUMBNAIL" />
                                    <p className='news-list-info news-category'>{news.category}</p>
                                    <p className='news-list-info news-title'>{news.title}</p>
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
                ) : null}
                {isTrending ? (
                    filteredTrendingNews.length > 0 ? (
                        filteredTrendingNews.map((news, index) => {
                            return (
                                <div className="news-list-card" key={news.id} onClick={() => {
                                    getUserClick(news.id);
                                    handleNewsSelect(news.id);
                                }}>
                                    <img className='trendingNews-img' src={news.img_url} alt="NEWS THUMBNAIL" />
                                    <p className='news-list-info news-category'>{news.category}</p>
                                    <p className='news-list-info news-title'>{news.title}</p>
                                    <div>
                                        <p className='news-author'>{news.author}</p>
                                        <p className='news-date'>{formatDate(news.date)}</p>
                                    </div>
                                    <p className='news-clicks'><b>Clicks:</b> {trendingNewsClicks[index].toLocaleString()}</p>
                                </div>
                            )
                        })
                    ) : (
                        <Loader />
                    )
                ) : null}
                {isRecommended ? (
                    filteredUserRecommendedNews.length > 0 ? (
                        filteredUserRecommendedNews.map((news) => {
                            return (
                                <div className="news-list-card" key={news.id} onClick={() => {
                                    getUserClick(news.id);
                                    handleNewsSelect(news.id);
                                }}>
                                    <img className='recommendedNews-img' src={news.img_url} alt="NEWS THUMBNAIL" />
                                    <p className='news-list-info news-category'>{news.category}</p>
                                    <p className='news-list-info news-title'>{news.title}</p>
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
                ) : null}
            </div>
            {wideInterest ? (
                wideInterestNews.length > 0 ? (
                    <>
                        <h2 className='outside-recommendations-banner'>Here are other news that is outside your recommendations...</h2>

                        <div className='news-list-container'>
                            {wideInterestNews.map((news) => {
                                return (
                                    <div className="news-list-card" key={news.id} onClick={() => {
                                        getUserClick(news.id);
                                        handleNewsSelect(news.id);
                                    }}>
                                        <img className='recommendedNews-img' src={news.img_url} alt="NEWS THUMBNAIL" />
                                        <p className='news-list-info news-category'>{news.category}</p>
                                        <p className='news-list-info news-title'>{news.title}</p>
                                        <div>
                                            <p className='news-author'>{news.author}</p>
                                            <p className='news-date'>{formatDate(news.date)}</p>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </>
                ) : (
                    null
                )
            ) :
                <h2 className='outside-recommendations-banner'>Looks like you have reached the end of your recommendations. </h2>
            }
        </div >
    )
}

export default NewsList