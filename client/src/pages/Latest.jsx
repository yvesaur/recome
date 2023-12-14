import React, { useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Latest = () => {
    const description = `Dive into our newest page for real-time updates, breaking news, and in-depth coverage on the stories shaping our world. 
                        From current events to exclusive insights, get your fingertips on the pulse of what matters most.`
    const [search, setSearch] = useState("")
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div id='latest-page'>
            <Header setSearch={setSearch} />
            <SelectCategory />
            <NewsList title="Latest" description={description} isLatest={true} search={search} />
            <Footer />
        </div>
    )
}

export default Latest