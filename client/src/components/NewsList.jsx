import React from 'react'
import "../assets/css/newslist.css"

const NewsList = ({ title, description }) => {
    return (
        <div id='news-list'>
            <div className='news-list-header'>
                <div>
                    <h1>{title}</h1>
                    <p>{description}
                    </p>
                </div>
            </div>
            <div className='news-list-container'>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
                <p>box 1</p>
                <p>box 2</p>
                <p>box 3</p>
                <p>box 4</p>
            </div>
        </div>
    )
}

export default NewsList