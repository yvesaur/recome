import React, { useContext, useEffect } from 'react'

import SelectCategory from '../components/SelectCategory'
import LatestNews from '../components/home/LatestNews'
import RecommendedNews from '../components/home/RecommendedNews'
import TrendingNews from '../components/home/TrendingNews'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Home = () => {
    const { isAuth, isAuthenticated } = useContext(NewsContext);

    useEffect(() => {
        isAuth();
    }, []);
    // console.log("IS AUTHENTICATED HOME", isAuthenticated);

    return (
        <div id='home-page'>
            <Header isAuthenticated={isAuthenticated} />
            <SelectCategory />
            <LatestNews />
            <TrendingNews />
            {isAuthenticated &&
                <RecommendedNews />
            }
            <Footer />
        </div>
    )
}

export default Home