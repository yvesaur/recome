import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Fetch from '../api/Fetch'
import "../assets/css/pages/newsdetail.css"
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const NewsDetail = () => {
    const { getUserClick, getUserImpression } = useContext(NewsContext);
    const [selectedNews, setSelectedNews] = useState();
    const [relatedNews, setRelatedNews] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    // console.log(id)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Fetch.get((`/news/${id}`))
                const response2 = await Fetch.get((`/news/related/${id}`))
                await setSelectedNews(response.data.data.news)
                await setRelatedNews(response2.data.data.news)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])
    // console.log("Related NEWS", relatedNews)
    // console.log("Selected NEWS", selectedNews)
    useEffect(() => {
        // getUserImpression(relatedNews);
    }, []);

    const handleNewsSelect = async (id) => {
        try {
            navigate(`/news/${id}`);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div id='news-detail-page'>
            <Header />
            <SelectCategory />
            <div className='selected-new-container'>
                {selectedNews &&
                    <div className='news-card news-detail-card' key={selectedNews.id} onClick={() => {

                    }}>
                        <p className='news-category'>{selectedNews.category}</p>
                        <p className='news-title'>{selectedNews.title}</p>
                        <img src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                        <p className='news-abstract'>{selectedNews.abstract}</p>
                        <div>
                            <p className='news-author'>Jessica Soho</p>
                            <p className='news-date'>November 27, 2023</p>
                        </div>
                    </div>

                }
            </div>
            <h1>Related</h1>
            <div className='related-news-container'>
                {relatedNews && relatedNews.slice(0, 4).map((news) => {
                    return (
                        news.id !== id && (
                            <div className={`news-card related-news`} key={news.id} onClick={() => {
                                getUserClick(news.id);
                                handleNewsSelect(news.id);
                            }}>
                                <img className='news-thumbnail' src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                                <p className='related-category'>{news.category}</p>
                                <p className='related-title'>{news.title}</p>
                                <div>
                                    <p className='news-author'>Jessica Soho</p>
                                    <p className='news-date'>November 28, 2023</p>
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