import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NewsArchive from '../components/NewsArchive'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Archive = () => {
    const { isAuthenticated, isAuth } = useContext(NewsContext);
    const [search, setSearch] = useState("")

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        isAuth()
    }, [])

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