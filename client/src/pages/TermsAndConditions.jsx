import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../assets/css/pages/termsandconditions.css";
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

const TermsAndConditions = ({ modelLogo, modelLogoDark }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div id='terms-page'>
      <Header modelLogo={modelLogo}></Header>
      <div className='terms-page-description'>
        <h2><b>Terms and Conditions for RecoMe:</b></h2>

        <p>
          <strong>Last Updated:</strong> January 02, 2023
        </p>

        <br />
        <section>
          <h3>1. Acceptance of Terms:</h3>
          <p>
            By using our website, you agree to abide by these Terms and Conditions.
            If you do not agree to these terms, please refrain from using our services.
          </p>
        </section>
        <br />
        <section>
          <h3>2. User Eligibility:</h3>
          <p>
            You must be at least 18 years old to use our website and services.
            By using our website, you affirm that you are over 18 years old or have
            obtained parental or guardian consent to use our services.
          </p>
        </section>
        <br />
        <section>
          <h3>3. User Account:</h3>
          <p>
            To access certain features of our website, you may be required to create a
            user account. We are responsible for maintaining the confidentiality of your
            account information and you are fully responsible for all activities that occur under
            your account.
          </p>
        </section>
        <br />
        <section>
          <h3>4. News Recommender:</h3>
          <p>
            Our news recommender service provides personalized news recommendations based on
            News features, your preferences and browsing behavior. While we strive to provide accurate and
            relevant recommendations, we do not guarantee the accuracy or suitability of the
            recommended content.
          </p>
        </section>
        <br />
        <section>
          <h3>5. User Conduct:</h3>
          <p>
            You agree not to use our website for any unlawful or prohibited purpose. You must
            not engage in any activity that could harm, disable, or otherwise impair the
            website or interfere with other users' access to our services.
          </p>
        </section>
        <br />
        <section>
          <h3>6. Intellectual Property:</h3>
          <p>
            All content on our website, including but not limited to text, graphics, logos,
            images, and software, is the property of RecoMe and is protected by
            intellectual property laws. You may not use, reproduce, or distribute any content
            from our website without our express written permission.
          </p>
        </section>
        <br />
        <section>
          <h3>7. Privacy Policy:</h3>
          <p>
            Our Privacy Policy governs the collection, use, and disclosure of your personal
            information. By using our services, you agree to our Privacy Policy. <span className='privacy-policy-link' onClick={() => { navigate("/dataprivacy") }}>Click Here</span> to learn more about our privacy policy.
          </p>
        </section>
        <br />
        <section>
          <h3>8. Disclaimer of Warranties:</h3>
          <p>
            Our website and services are provided "as is" and "as available" without any
            warranties of any kind. We do not guarantee the accuracy, completeness, or
            timeliness of the content on our website.
          </p>
        </section>
        <br />
        <section>
          <h3>9. Limitation of Liability:</h3>
          <p>
            RecoMe shall not be liable for any direct, indirect, incidental,
            special, or consequential damages arising out of or in any way connected with
            the use of our website or services.
          </p>
        </section>
        <br />
        <section>
          <h3>10. Modification of Terms:</h3>
          <p>
            RecoMe reserves the right to modify or update these Terms and
            Conditions at any time without prior notice. It is your responsibility to
            review these terms periodically for changes.
          </p>
        </section>
        <br />
        <p>
          By using our website, you acknowledge that you have read, understood, and
          agree to be bound by these Terms and Conditions. If you have any questions
          or concerns, please contact us at <b>recomenewsteam@gmail.com/09271311257</b>.
        </p>

      </div>
      <Footer modelLogoDark={modelLogoDark}></Footer>
    </div>
  )
}

export default TermsAndConditions