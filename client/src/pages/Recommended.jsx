import React from 'react'

import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Recommended = () => {
    return (
        <div id='recommended-page'>
            <Header />
            <SelectCategory />
            <NewsList />
            <Footer />
        </div>
    )
}

export default Recommended