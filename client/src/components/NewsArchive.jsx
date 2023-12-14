import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../api/Fetch';
import "../assets/css/newsarchive.css";
import { NewsContext } from '../context/NewsContext';
import Loader from './animation/Loader';

const NewsArchive = ({ search }) => {
    const { getUserClick, formatDate } = useContext(NewsContext);
    const [allNews, setAllNews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get("/fetchNews")
                console.log("ALL NEWS: ", response.data.data)
                setAllNews(response.data.data.news)
            } catch (error) {
                console.error(error.message)
            }
        }
        fetchData();
    }, [])

    const handleNewsSelect = async (id) => {
        try {
            navigate(`/news/${id}`);
            const response = await Fetch.get((`/news/${id}`))
        } catch (error) {
            console.log(error);
        }
    }

    const filteredNews = useMemo(() => {
        return allNews.filter((news) => {
            return search.toLowerCase() === '' ? news : news.title.toLowerCase().includes(search);
        });
    }, [allNews, search]);

    return (
        <div className='news-archive'>
            <div className='all-news-container'>
                {filteredNews.length > 0 ? (
                    filteredNews.map((news) => {
                        return (
                            <div className='news-card all-news' key={news.id} onClick={() => {
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
                ) : (search.length > 0) ? (
                    <h1 className='no-search-found'>No Search Found</h1>
                ) : (
                    <Loader />
                )}
                {
                    /* 
                    {allNews && allNews.filter((news) => {
                    return search.toLowerCase() === '' ? news : news.title.toLowerCase().includes(search);
                }).map((news) => {
                    return (
                        <div className='news-card all-news' key={news.id} onClick={() => {
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
                    
                    */
                }
            </div>
        </div>
    )
}

export default NewsArchive