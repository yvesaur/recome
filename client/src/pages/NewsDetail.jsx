import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Fetch from '../api/Fetch'
import "../assets/css/pages/newsdetail.css"
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const NewsDetail = () => {
    const { getUserClick, getUserImpression, isAuth, formatDate } = useContext(NewsContext);
    const [selectedNews, setSelectedNews] = useState();
    const [relatedNews, setRelatedNews] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const hasCalledGetUserImpression = useRef(false);
    // console.log(id)

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get((`/news/${id}`))
                const response2 = await Fetch.get((`/news/related/${id}`))
                setSelectedNews(response.data.data.news)
                setRelatedNews(response2.data.data.news)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])
    // console.log("Related NEWS", relatedNews)
    // console.log("Selected NEWS", selectedNews)

    useEffect(() => {
        isAuth()
    }, [])

    useEffect(() => {
        if (!hasCalledGetUserImpression.current && relatedNews) {
            getUserImpression(relatedNews);
            hasCalledGetUserImpression.current = true;
        }
    }, [relatedNews]);

    const handleNewsSelect = async (id) => {
        try {
            navigate(`/news/${id}`);
            const response = await Fetch.get((`/news/${id}`))
            setSelectedNews(response.data.data.news)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='news-detail-page'>
            <Header />
            <SelectCategory />
            <div className='selected-news-container'>
                {selectedNews &&
                    <div className='news-card news-detail-card' key={selectedNews.id} onClick={() => {

                    }}>
                        <p className='news-category'>{selectedNews.category}</p>
                        <p className='news-title'>{selectedNews.title}</p>
                        <div>
                            <p className='news-author'>{selectedNews.author}</p>
                            <p className='news-date'>{formatDate(selectedNews.date)}</p>
                        </div>
                        <img className='selectedNews-img' src={selectedNews.img_url} alt="NEWS THUMBNAIL" />
                        <p className='news-abstract'>{selectedNews.abstract}</p>
                    </div>

                }
            </div>
            <h1>Related  News you might like</h1>
            <div className='related-news-container'>
                {relatedNews && relatedNews.slice(0, 4).map((news) => {
                    return (
                        news.id !== id && (
                            <div className={`news-card related-news`} key={news.id} onClick={() => {
                                getUserClick(news.id);
                                handleNewsSelect(news.id);
                            }}>
                                <img id='news-thumbnail' src={news.img_url} alt="NEWS THUMBNAIL" />
                                <p className='related-category'>{news.category}</p>
                                <p className='related-title'>{news.title}</p>
                                <div>
                                    <p className='news-author'>{news.author}</p>
                                    <p className='news-date'>{formatDate(news.date)}</p>
                                </div>
                            </div>
                        )
                    );
                })}
            </div>
            <Footer />
        </div>
    )
}

export default NewsDetail