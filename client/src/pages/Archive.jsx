import React, { useContext } from 'react'
import NewsArchive from '../components/NewsArchive'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Archive = () => {
    const { isAuthenticated } = useContext(NewsContext);
    return (
        <div id='archive-page'>
            <Header isAuthenticated={isAuthenticated} />
            <SelectCategory />
            <h1>News Archive</h1>
            <NewsArchive />
            <Footer />
        </div>
    )
}

export default Archive