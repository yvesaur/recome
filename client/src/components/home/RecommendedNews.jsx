import { React, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../api/Fetch';
import "../../assets/css/home/recommendednews.css";
import { NewsContext } from '../../context/NewsContext';
import Loader from '../animation/Loader';

const RecommendedNews = () => {
    const navigate = useNavigate();
    const { getUserClick, currentUserID, formatDate } = useContext(NewsContext);
    const [userRecommendedNews, setUserRecommendedNews] = useState([]);

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

    return (
        <div id='recommended-news'>
            <div className='recommended-news-header'>
                <h2>For You</h2>
                <p onClick={() => navigate('/recommended')}>See All</p>
            </div>
            <div className='recommended-news-container'>
                {RecommendedNews.length > 0 ? (
                    userRecommendedNews.slice(0, 3).map((news) => {
                        return (
                            <div className='news-card recommended-news' key={news.id} onClick={() => {
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
                )}
            </div>
        </div>
    )
}

export default RecommendedNews