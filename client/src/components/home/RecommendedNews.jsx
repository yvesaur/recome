import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../api/Fetch';
import "../../assets/css/home/recommendednews.css";

const RecommendedNews = () => {
    const navigate = useNavigate();
    const [latestNews, setLatestNews] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get("/news")
                setLatestNews(response.data.data.news)
            } catch (error) {
                console.error(error.message)
            }
        }
        fetchData();
    }, [])

    return (
        <div id='recommended-news'>
            <div className='recommended-news-header'>
                <h2>For You</h2>
                <p onClick={() => navigate('/recommended')}>See All</p>
            </div>
            <div className='recommended-news-container'>
                {latestNews && latestNews.slice(0, 3).map((news) => {
                    return (
                        <div className='recommended-news' key={news.id}>
                            <img src="" alt="NEWS THUMBNAIL" />
                            <p>{news.category}: {news.subcategory}</p>
                            <p>{news.title}</p>
                            <p>{news.abstract}</p>
                            <p>November 28, 2023</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RecommendedNews