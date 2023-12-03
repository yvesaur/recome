import React from 'react'

import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Latest = () => {
    const description = `Dive into our newest page for real-time updates, breaking news, and in-depth coverage on the stories shaping our world. 
                        From current events to exclusive insights, get your fingertips on the pulse of what matters most.`

    return (
        <div id='latest-page'>
            <Header />
            <SelectCategory />
            <NewsList title="Latest" description={description} isLatest={true} />
            <Footer />
        </div>
    )
}

export default Latest