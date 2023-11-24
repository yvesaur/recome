import React from 'react'

import SelectCategory from '../components/SelectCategory'
import LatestNews from '../components/home/LatestNews'
import RecommendedNews from '../components/home/RecommendedNews'
import TrendingNews from '../components/home/TrendingNews'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Home = () => {
    return (
        <div id='home-page'>
            <Header />
            <SelectCategory />
            <LatestNews />
            <TrendingNews />
            <RecommendedNews />
            <Footer />
        </div>
    )
}

export default Home