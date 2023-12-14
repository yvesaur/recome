import React from 'react'
import { NavLink } from 'react-router-dom'
import "../assets/css/selectnewscategory.css"

const SelectNewsCategory = () => {

    return (
        <nav id='select-news-category'>
            <ul>
                <li>
                    <NavLink activeClassName="active" to="/category/news">News</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/sports">TV Showbiz</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/health">Sports</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/lifestyle">Femail</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/news">Money</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/sports">Health</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/health">Science & Technology</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/lifestyle">Travel</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/news">Debate</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/sports">UK Shopping</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/health">Your Money</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/lifestyle">Property</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/news">US Shopping</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/sports">UK Wellness</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/health">US Wellness</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/lifestyle">Galleries</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/health">Video</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/category/lifestyle">Best Buys</NavLink>
                </li>
            </ul>

        </nav>
    )
}

export default SelectNewsCategory