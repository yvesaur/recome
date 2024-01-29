import React, { useContext, useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import LatestNews from '../components/home/LatestNews'
import RecommendedNews from '../components/home/RecommendedNews'
import TrendingNews from '../components/home/TrendingNews'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Home = ({ modelLogo, modelLogoDark }) => {
    const { isAuth, isAuthenticated } = useContext(NewsContext);
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])

    useEffect(() => {
        isAuth();
    }, []);
    // console.log("IS AUTHENTICATED HOME", isAuthenticated);

    return (
        <div id='home-page'>
            <Header isAuthenticated={isAuthenticated} isDisabled={true} modelLogo={modelLogo} />
            <LatestNews />
            <TrendingNews />
            {isAuthenticated &&
                <RecommendedNews />
            }
            <Footer modelLogoDark={modelLogoDark} />
        </div>
    )
}

export default Home