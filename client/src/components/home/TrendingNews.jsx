import { React, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../api/Fetch';
import "../../assets/css/home/trendingnews.css";
import { NewsContext } from '../../context/NewsContext';


const TrendingNews = () => {
    const navigate = useNavigate();
    const { trendingNews, getUserClick, formatDate } = useContext(NewsContext);
    console.log("TRENDING NEWS: ", trendingNews);

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
                })}
            </div>
        </div>
    )
}

export default TrendingNews