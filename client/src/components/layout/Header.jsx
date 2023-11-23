import React from 'react'
import "../../assets/css/layout/header.css"

const Header = () => {
    return (
        <div id='header'>
            <input className='search-news' type="search" name="searchNews" id="searchNews" placeholder='search' />
            <img src={require("../../assets/img/recome-light.png")} alt="Recome Logo Icon" />
            <div className='register-guest'>
                <p>Sign In</p>
                <button>Register</button>
            </div>
        </div>
    )
}

export default Header