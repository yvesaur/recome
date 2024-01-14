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

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredNews]);

    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 20;
    const pageNumbersToShow = 5;

    // ...

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredNews.length / newsPerPage); i++) {
        pageNumbers.push(i);
    }

    const indexOfLastPageNumber = Math.min(pageNumbersToShow * Math.ceil(currentPage / pageNumbersToShow), pageNumbers.length);

    const indexOfFirstPageNumber = indexOfLastPageNumber - pageNumbersToShow;

    let currentPages = pageNumbers.slice(indexOfFirstPageNumber, indexOfLastPageNumber);
    if (!currentPages.includes(1)) {
        currentPages = [1, ...currentPages];
    }



    return (
        <div id='news-archive'>
            <div className='all-news-container'>
                {currentNews.length > 0 ? (
                    currentNews.map((news) => {
                        return (
                            <div className='news-card all-news-card' key={news.id} onClick={() => {
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
                    }
                    )

                ) : (search.length > 0) ? (
                    <Loader />
                ) : (
                    <Loader />
                )}
            </div>
            <div className="pagination">
                <button className="pagination-button" onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}>
                    <i class="fa-solid fa-angle-left"></i>
                </button>

                {currentPages.map(number => (
                    <button
                        key={number}
                        className={`pagination-button ${number === currentPage ? 'active' : ''}`}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </button>
                ))}

                <button className="pagination-button" onClick={() => paginate(currentPage < pageNumbers.length ? currentPage + 1 : pageNumbers.length)}>
                    <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
        </div>
    )
}

export default NewsArchive