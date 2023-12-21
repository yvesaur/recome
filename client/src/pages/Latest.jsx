import React, { useContext, useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Latest = () => {
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
            <Header setSearch={setSearch} isAuthenticated={isAuthenticated} />
            <SelectCategory />
            <NewsList title="Latest" description={description} isLatest={true} search={search} />
            <Footer />
        </div>
    )
}

export default Latest