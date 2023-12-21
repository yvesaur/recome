import React, { useContext, useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { NewsContext } from '../context/NewsContext'

const Recommended = () => {
    const description = `Curated selection of articles, news stories, and content tailored specifically to your interests and  preferences.
                        It serves as a hub where you can discover new and relevant information that aligns with your specific areas of interest.`
    const [search, setSearch] = useState("")
    const { pathname } = useLocation();
    const { isAuthenticated, isAuth } = useContext(NewsContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        isAuth()
    }, [])

    return (
        <div id='recommended-page'>
            <Header setSearch={setSearch} isAuthenticated={isAuthenticated} />
            <SelectCategory />
            <NewsList title="Recommended" description={description} isRecommended={true} search={search} />
            <Footer />
        </div>
    )
}

export default Recommended