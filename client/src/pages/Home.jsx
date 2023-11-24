import React from 'react'

import LatestNews from '../components/LatestNews'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Home = () => {
    return (
        <div id='home-page'>
            <Header />
            <SelectCategory />
            <LatestNews></LatestNews>
            <Footer />
        </div>
    )
}

export default Home