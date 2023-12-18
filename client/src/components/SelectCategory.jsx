import React, { useContext } from 'react'
import { NavLink } from "react-router-dom"

import "../assets/css/selectcategory.css"
import { NewsContext } from '../context/NewsContext'

const SelectCategory = () => {
    const { isAuthenticated } = useContext(NewsContext);

    return (
        <nav id='select-category'>
            <ul className='category-ul'>
                <li>
                    <NavLink activeClassName="active" to="/">Home</NavLink>
                </li>
                {isAuthenticated &&
                    <li>
                        <NavLink activeClassName="active" to="/recommended">Recommended</NavLink>
                    </li>
                }
                <li>
                    <NavLink activeClassName="active" to="/latest">Latest</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/trending">Trending</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/archive">All</NavLink>
                </li>
            </ul>

        </nav>
    )
}

export default SelectCategory