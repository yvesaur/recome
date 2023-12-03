import React from 'react'

import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Recommended = () => {
    const description = `Curated selection of articles, news stories, and content tailored specifically to your interests and  preferences.
                        It serves as a hub where you can discover new and relevant information that aligns with your specific areas of interest.`

    return (
        <div id='recommended-page'>
            <Header />
            <SelectCategory />
            <NewsList title="Recommended" description={description} isRecommended={true} />
            <Footer />
        </div>
    )
}

export default Recommended