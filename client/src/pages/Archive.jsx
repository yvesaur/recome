import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NewsArchive from '../components/NewsArchive'

import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Archive = ({ modelLogo, modelLogoDark }) => {
    const { isAuthenticated, isAuth, searchOutsideArchive } = useContext(NewsContext);
    const [search, setSearch] = useState(searchOutsideArchive || "")

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        isAuth()
    }, [])

    return (
        <div id='archive-page'>
            <Header isAuthenticated={isAuthenticated} setSearch={setSearch} modelLogo={modelLogo} />
            <h1>News Archive</h1>
            <NewsArchive search={search} />
            <Footer modelLogoDark={modelLogoDark} />
        </div>
    )
}

export default Archive