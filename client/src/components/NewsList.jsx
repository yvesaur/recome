import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../api/Fetch';
import "../assets/css/newslist.css";

const NewsList = ({ title, description }) => {
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

    console.log(latestNews)
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
                {latestNews && latestNews.map((news, index) => {
                    return (
                        <div className="news-list-card" key={news.id} onClick={() => {
                            handleNewsSelect(news.id);
                        }}>
                            <img className='' src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                            <p className='news-list-info news-category'>{news.category}</p>
                            <p className='news-list-info news-title'>{news.title}</p>
                            <div>
                                <p className='news-author'>Jessica Soho</p>
                                <p className='news-date'>November 28, 2023</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default NewsList