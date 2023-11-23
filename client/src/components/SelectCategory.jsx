import React from 'react'
import { NavLink } from "react-router-dom"

import "../assets/css/selectcategory.css"

const SelectCategory = () => {
    return (
        <nav id='select-category'>
            <ul>
                <li>
                    <NavLink axact activeClassName="active" to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to="/latest">Latest</NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to="/recommended">Recommended</NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to="/trending">Trending</NavLink>
                </li>
            </ul>

        </nav>
    )
}

export default SelectCategory