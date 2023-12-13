import React from 'react'
import { NavLink } from 'react-router-dom'
import "../assets/css/selectnewscategory.css"

const SelectNewsCategory = () => {

    return (
        <nav id='select-news-category'>
            <ul>
                <li>
                    <NavLink activeClassName="active" to="">News</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="">Sports</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="">Health</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="">Lifestyle</NavLink>
                </li>
            </ul>

        </nav>
    )
}

export default SelectNewsCategory