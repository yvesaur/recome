import React from 'react'
import { NavLink } from "react-router-dom"

import "../assets/css/selectcategory.css"

const SelectCategory = () => {
    return (
        <nav id='select-category'>
            <ul>
                <li>
                    <NavLink activeClassName="active" to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/latest">Latest</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/recommended">Recommended</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/trending">Trending</NavLink>
                </li>
            </ul>

        </nav>
    )
}

export default SelectCategory