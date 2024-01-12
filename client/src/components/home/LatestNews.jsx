import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Fetch from '../../api/Fetch'
import "../../assets/css/home/latestnews.css"
import { NewsContext } from '../../context/NewsContext'
import Loader from '../animation/Loader'

const LatestNews = () => {
    const navigate = useNavigate();
    const { getUserClick, formatDate } = useContext(NewsContext);
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
                {latestNews.length > 0 ? (
                    latestNews.slice(0, 6).map((news, index) => {
                        return (
                            <div className={`news-card latest-news-${index}`} key={news.id} onClick={() => {
                                getUserClick(news.id);
                                handleNewsSelect(news.id);
                            }}>
                                <img className='news-thumbnail' src={news.img_url} alt="NEWS THUMBNAIL" />
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
            <p className='see-all-btn' onClick={() => navigate('/latest')}>See All</p>
        </div>
    )
}

export default LatestNews