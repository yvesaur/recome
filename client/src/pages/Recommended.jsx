import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Recommended = () => {
    const description = `Curated selection of articles, news stories, and content tailored specifically to your interests and  preferences.
                        It serves as a hub where you can discover new and relevant information that aligns with your specific areas of interest.`
    const [search, setSearch] = useState("")
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div id='recommended-page'>
            <Header setSearch={setSearch} />
            <SelectCategory />
            <NewsList title="Recommended" description={description} isRecommended={true} search={search} />
            <Footer />
        </div>
    )
}

export default Recommended