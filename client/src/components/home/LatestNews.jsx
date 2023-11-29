import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Fetch from '../../api/Fetch'
import "../../assets/css/home/latestnews.css"

const LatestNews = () => {
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
        <div id='latest-news'>
            <h2>Latest</h2>
            <div className='latest-news-container'>
                {latestNews && latestNews.slice(0, 5).map((news, index) => {
                    return (
                        <div className={`news-card latest-news-${index}`} key={news.id} onClick={() => {
                            handleNewsSelect(news.id);
                        }}>
                            <img className='news-thumbnail' src={require("../../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                            <p className='news-category'>{news.category}: {news.subcategory}</p>
                            <p className='news-title'>{news.title}</p>
                            <div>
                                <p className='news-author'>Jessica Soho</p>
                                <p className='news-date'>November 28, 2023</p>
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