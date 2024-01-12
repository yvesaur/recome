import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/layout/footer.css';

const Footer = () => {
    let navigate = useNavigate();

    const iconColor = {
        color: '#030303'
    };

    return (
        <div id='footer'>
            <img src={require("../../assets/img/recome-black.png")} alt="" />
            <div className="social-link">
                <a href="https://www.google.com/">
                    <i className="fa-brands fa-x-twitter" style={iconColor}></i>
                </a>
                <a href="https://www.google.com/">
                    <i className="fa-brands fa-facebook-f" style={iconColor}></i>
                </a>
                <a href="https://www.google.com/">
                    <i className="fa-brands fa-instagram" style={iconColor}></i>
                </a>
            </div>
            <div className="info-page">
                <p onClick={() => navigate('/about')}>About</p>
                <p onClick={() => navigate('/termsandconditions')}>Terms & Conditions</p>
                <p onClick={() => navigate('/archive')}>Archives</p>
            </div>
            <p>
                © RecoMe News
            </p>
        </div>
    )
}

export default Footer