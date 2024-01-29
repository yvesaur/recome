import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import "../assets/css/pages/dataprivacy.css"
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'

const DataPrivacy = ({ modelLogo, modelLogoDark }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <div id='data-privacy-page'>
            <Header modelLogo={modelLogo} />
            <div className='dataprivacy-page-description'>
                <h2><b>Data Privacy Policy for RecoMe:</b></h2>

                <br />
                <section>
                    <h3>1. Overview:</h3>
                    <p>
                        Welcome to RecoMe. This Data Privacy Policy outlines how we collect and use your personal information when you use our website.
                    </p>
                </section>
                <br />
                <section>
                    <h3>2. Information We Collect:</h3>
                    <p>
                        <ul>
                            <li>
                                User Registration: When you create an account, we collect your name, email address, and password.
                            </li>
                            <li>
                                Personalization Data: We collect data on your interactions with the website, such as the articles you read or the preferences you set.
                            </li>
                        </ul>
                    </p>
                </section>
                <br />
                <section>
                    <h3>3. How We Use Your Information:</h3>
                    <p>
                        <ul>
                            <li>
                                Personalization: We use your data to personalize your news recommendations based on your interests.
                            </li>
                            <li>
                                Communication: We may use your email to send important updates or newsletters. You have the option to choose whether to receive article news communications.
                            </li>
                        </ul>
                    </p>
                </section>
                <br />
                <section>
                    <h3>4. Data Security:</h3>
                    <p>
                        We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.
                    </p>
                </section>
                <br />
                <section>
                    <h3>5. User Controls:</h3>
                    <p>
                        You have the right to access, correct, or delete your personal information. You can manage your preferences through your account settings.
                        And you can contact us to delete your information in the database

                    </p>
                </section>
                <br />
                <section>
                    <h3>6. Changes to This Policy:</h3>
                    <p>
                        We may update this Privacy Policy from time to time. Any significant changes will be communicated via email or through a notice on our website.
                    </p>
                </section>
                <br />
                <section>
                    <h3>7. Contact Us:</h3>
                    <p>
                        If you have questions or concerns about our Data Privacy Policy, please contact us at recomenewsteam@gmail.com.
                    </p>
                </section>
                <br />
                <br />
                <p>
                    By using RecoMe, you agree to the terms outlined in this Privacy Policy.
                </p>

            </div>
            <Footer modelLogoDark={modelLogoDark} />
        </div>
    )
}

export default DataPrivacy