import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Fetch from '../api/Fetch'
import "../assets/css/pages/newsdetail.css"
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const NewsDetail = () => {
    const [selectedNews, setSelectedNews] = useState();
    const [relatedNews, setRelatedNews] = useState();
    const { id } = useParams();
    console.log(id)

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
    console.log("Related NEWS", relatedNews)

    return (
        <div id='news-detail-page'>
            <Header />
            <SelectCategory />
            {selectedNews &&
                <div className='news-card trending-news' key={selectedNews.id} onClick={() => {
                }}>
                    <img src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                    <p className='news-category'>{selectedNews.category}: {selectedNews.subcategory}</p>
                    <p className='news-title'>{selectedNews.title}</p>
                    <p className='news-abstract'>{selectedNews.abstract}</p>
                    <div>
                        <p className='news-author'>Jessica Soho</p>
                        <p className='news-date'>November 27, 2023</p>
                    </div>
                </div>

            }
            <h1>Related</h1>
            {relatedNews && relatedNews.map((news, index) => {
                return (
                    <div className={`news-card related-news`} key={news.id}>
                        <img className='news-thumbnail' src={require("../assets/img/test_picture.png")} alt="NEWS THUMBNAIL" />
                        <p className='news-category'>{news.category}: {news.subcategory}</p>
                        <p className='news-title'>{news.title}</p>
                        <div>
                            <p className='news-author'>Jessica Soho</p>
                            <p className='news-date'>November 28, 2023</p>
                        </div>
                    </div>
                )
            })}
            <Footer />
        </div>
    )
}

export default NewsDetail