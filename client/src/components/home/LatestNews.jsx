import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Fetch from '../../api/Fetch'
import "../../assets/css/home/latestnews.css"
import { NewsContext } from '../../context/NewsContext'

const LatestNews = () => {
    const navigate = useNavigate();
    const { getUserClick } = useContext(NewsContext);
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

    // console.log(latestNews)
    const handleNewsSelect = (id) => {
        try {
            navigate(`/news/${id}`)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='latest-news'>
            <h2>Latest</h2>
            <div className='latest-news-container'>
                {latestNews && latestNews.slice(0, 5).map((news, index) => {
                    return (
                        <div className={`news-card latest-news-${index}`} key={news.id} onClick={() => {
                            getUserClick(news.id);
                            handleNewsSelect(news.id);
                        }}>
                            <img className='news-thumbnail' src={require("../../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                            <p className='news-category'>{news.category}</p>
                            <p className='news-title'>{news.title}</p>
                            <div>
                                <p className='news-author'>{news.author}</p>
                                <p className='news-date'>{news.date}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <p onClick={() => navigate('/latest')}>See All</p>
        </div>
    )
}

export default LatestNews