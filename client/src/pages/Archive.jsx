import React from 'react'
import NewsArchive from '../components/NewsArchive'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Archive = () => {
    return (
        <div id='archive-page'>
            <Header />
            <SelectCategory />
            <h1>News Archive</h1>
            <NewsArchive />
            <Footer />
        </div>
    )
}

export default Archive