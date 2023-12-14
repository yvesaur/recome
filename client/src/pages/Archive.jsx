import React, { useContext, useState } from 'react'
import NewsArchive from '../components/NewsArchive'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Archive = () => {
    const { isAuthenticated } = useContext(NewsContext);
    const [search, setSearch] = useState("")
    return (
        <div id='archive-page'>
            <Header isAuthenticated={isAuthenticated} setSearch={setSearch} />
            <SelectCategory />
            <h1>News Archive</h1>
            <NewsArchive search={search} />
            <Footer />
        </div>
    )
}

export default Archive