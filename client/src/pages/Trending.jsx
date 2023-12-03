import React from 'react'

import NewsList from '../components/NewsList'
import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Trending = () => {
    const description = `Explore our Trending Page for the hottest topics, viral stories, and must-know trends captivating the online sphere. 
                        Stay in the loop with the latest conversations, popular articles, and social media sensations that are making waves across the digital landscape. 
                        Your go-to destination for staying ahead of the curve and being part of the trending discussions.`

    return (

        <div id='trending-page'>
            <Header />
            <SelectCategory />
            <NewsList title="Trending" description={description} isTrending={true} />
            <Footer />
        </div>
    )
}

export default Trending