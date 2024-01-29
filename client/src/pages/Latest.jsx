import React, { useContext, useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import NewsList from '../components/NewsList'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Latest = ({ modelLogo, modelLogoDark }) => {
    const description = `Dive into our newest page for real-time updates, breaking news, and in-depth coverage on the stories shaping our world. 
                        From current events to exclusive insights, get your fingertips on the pulse of what matters most.`
    const [search, setSearch] = useState("")
    const { pathname } = useLocation();
    const { isAuthenticated, isAuth } = useContext(NewsContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        isAuth();
    }, []);

    return (
        <div id='latest-page'>
            <Header setSearch={setSearch} isAuthenticated={isAuthenticated} modelLogo={modelLogo} />
            <NewsList title="Latest" description={description} isLatest={true} search={search} />
            <Footer modelLogoDark={modelLogoDark} />
        </div>
    )
}

export default Latest