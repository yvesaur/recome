import React from 'react'

import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import SelectCategory from '../components/SelectCategory'

const Home = () => {
    return (
        <div id='home-page'>
            <Header />
            <SelectCategory />
            <Footer />
        </div>
    )
}

export default Home