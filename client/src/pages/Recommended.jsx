import React from 'react'

import SelectCategory from '../components/SelectCategory'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const Recommended = () => {
    return (
        <div id='recommended-page'>
            <Header />
            <SelectCategory />
            <Footer />
        </div>
    )
}

export default Recommended