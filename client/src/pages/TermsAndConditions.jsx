import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../assets/css/pages/termsAndconditions.css";
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

const TermsAndConditions = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div id='terms-page'>
      <Header></Header>
      <div className='terms-page-description'>


      </div>
      <Footer></Footer>
    </div>
  )
}

export default TermsAndConditions