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

    return (
        <div id='latest-news'>
            <h2>Latest</h2>
            <div className='latest-news-container'>
                {latestNews && latestNews.map((news) => {
                    return (
                        <div className='latest-news' key={news.id}>
                            <img src="" alt="NEWS THUMBNAIL" />
                            <p>{news.category}: {news.subcategory}</p>
                            <p>{news.title}</p>
                            <p>{news.abstract}</p>
                            <p>November Me, Kapag nagiisa</p>
                        </div>
                    )
                })}
            </div>
            <p onClick={() => navigate('/latest')}>See All</p>
        </div>
    )
}

export default LatestNews