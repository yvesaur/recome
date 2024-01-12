import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '../assets/css/pages/about.css'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const About = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div id='about-page'>
            <Header></Header>
            <div className='about-page-description'>
                <p>
                    Welcome to <b>RecoMe</b>, where the intersection of curiosity and innovation fuels our passion for news recommendation models. Our mission is to delve into the realm of cutting-edge technology, specifically focusing on news recommendation systems, with the ultimate goal of advancing and refining their capabilities.
                </p>
                <br></br>
                <p>
                    At <b>RecoMe</b>, we recognize the pivotal role that news recommendation models play in shaping the way we consume information in the digital age. Our platform is dedicated to fostering a deeper understanding of these models, unraveling their intricacies, and contributing to the evolution of intelligent, personalized news recommendations.
                </p>
                <br></br>
                <p>
                    As an integral part of the learning community, our website is designed to be an educational hub where enthusiasts, researchers, and developers converge to explore, experiment, and share insights. Whether you're a seasoned professional in the field or a curious learner eager to understand the nuances of news recommendation models, you'll find a welcoming space here at <b>RecoMe</b>.
                </p>
                <br></br>
                <p>
                    In our journey to enhance news recommendation models, we prioritize transparency and accountability. Users can trust that we are committed to ethical practices in data usage, respecting user privacy, and ensuring the responsible development of our recommendation algorithms.
                </p>
                <br></br>
                <p>
                    We invite users to actively participate in our research and development process. Your feedback and insights are invaluable in shaping the future of our news recommendation model. Together, we can create a platform that not only delivers personalized news but also empowers users to be active participants in the evolution of news recommendation technology.
                </p>
                <br></br>
                <div className='contact-us'><b>Contact Us:</b></div>
                <p>
                    We welcome inquiries, collaborations, and feedback from our users and the broader community. Feel free to reach out to us at <b>recomenewsteam@gmail.com/09271311257</b>. Thank you for being a part of our research, where curiosity meets innovation in the realm of news recommendation models.
                </p>

            </div>
            <Footer></Footer>
        </div>
    )
}

export default About