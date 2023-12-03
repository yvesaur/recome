import React, { useContext } from 'react';
import { NewsContext } from '../context/NewsContext';

const NewsArchive = () => {
    const { latestNews } = useContext(NewsContext);

    return (
        <div className='news-archive'>

        </div>
    )
}

export default NewsArchive