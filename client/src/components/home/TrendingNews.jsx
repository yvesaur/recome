import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../api/Fetch';
import "../../assets/css/home/trendingnews.css";


const TrendingNews = () => {
    const navigate = useNavigate();
    const [trendingNews, setTrendingNews] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get("/getTrendingNews")
                setTrendingNews(response.data.data.news)
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
        <div id='trending-news'>
            <div className='trending-news-header'>
                <h2>Trending</h2>
                <p onClick={() => navigate('/trending')}>See All</p>
            </div>
            <div className='trending-news-container'>
                {trendingNews && trendingNews.slice(0, 4).map((news) => {
                    return (
                        <div className='news-card trending-news' key={news.id} onClick={() => {
                            handleNewsSelect(news.id);
                        }}>
                            <img src={require("../../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                            <p className='news-category'>{news.category}: {news.subcategory}</p>
                            <p className='news-title'>{news.title}</p>
                            <div>
                                <p className='news-author'>Jessica Soho</p>
                                <p className='news-date'>November 27, 2023</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TrendingNews