import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../api/Fetch';
import "../assets/css/newslist.css";
import { NewsContext } from '../context/NewsContext';

const NewsList = ({ title, description, isRecommended, isTrending, isLatest }) => {
    const navigate = useNavigate();
    const { latestNews, trendingNews, getUserClick, trendingNewsClicks } = useContext(NewsContext);
    // console.log(trendingNews)

    const handleNewsSelect = (id) => {
        try {
            navigate(`/news/${id}`)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div id='news-list'>
            <div className='news-list-header'>
                <div>
                    <h1>{title}</h1>
                    <p>{description}
                    </p>
                </div>
            </div>
            <div className='news-list-container'>
                {isLatest &&
                    latestNews && latestNews.map((news, index) => {
                        return (
                            <div className="news-list-card" key={news.id} onClick={() => {
                                getUserClick(news.id);
                                handleNewsSelect(news.id);
                            }}>
                                <img className='' src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                                <p className='news-list-info news-category'>{news.category}</p>
                                <p className='news-list-info news-title'>{news.title}</p>
                                <div>
                                    <p className='news-author'>{news.author}</p>
                                    <p className='news-date'>{news.date}</p>
                                </div>
                            </div>
                        )
                    })
                }
                {isTrending &&
                    trendingNews && trendingNews.map((news, index) => {
                        return (
                            <div className="news-list-card" key={news.id} onClick={() => {
                                getUserClick(news.id);
                                handleNewsSelect(news.id);
                            }}>
                                <img className='' src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                                <p className='news-list-info news-category'>{news.category}</p>
                                <p className='news-list-info news-title'>{news.title}</p>
                                <div>
                                    <p className='news-author'>Jessica Soho</p>
                                    <p className='news-date'>November 28, 2023</p>
                                </div>
                                <p className='news-clicks'><b>Clicks:</b> {trendingNewsClicks[index].toLocaleString()}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default NewsList