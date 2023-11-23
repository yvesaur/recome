import React from 'react'

import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Trending = () => {
    return (
        <div id='trending-page'>
            <Header />
            <SelectCategory />
            <Footer />
        </div>
    )
}

export default Trending