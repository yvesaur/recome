import React, { useContext, useState } from 'react';
import { NewsContext } from '../context/NewsContext';

const NewsArchive = () => {
    const { latestNews } = useContext(NewsContext);
    const [allNews, setAllNews] = useState([]);

    return (
        <div className='news-archive'>

        </div>
    )
}

export default NewsArchive