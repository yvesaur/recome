import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/pages/register.css";
import { NewsContext } from '../context/NewsContext';

const Register = () => {
    const { setAuth, notifySuccess, notifyError } = useContext(NewsContext);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        interest_areas: [],
        wide_interest: true,
        topic_exclusions: [],
        trending_news: ""
    })
    const { username, firstName, lastName, email, password, interest_areas, wide_interest, topic_exclusions, trending_news } = inputs
    const [isDetail, setIsDetail] = useState(true);
    const [isInterest, setIsInterest] = useState(false);
    const [isWideInterest, setWideIsInterest] = useState(false);
    const [isExclusions, setIsExclusions] = useState(false);
    const [isTrendingImportant, setIsTrendingImportant] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);

    const [isHealthActive, setIsHealthActive] = useState(false);
    const [isSportsActive, setIsSportsActive] = useState(false);
    const [isNewsActive, setIsNewsActive] = useState(false);
    const [isWeatherActive, setIsWeatherActive] = useState(false);
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [isMoviesActive, setIsMoviesActive] = useState(false);
    const [isLifestyleActive, setIsLifestyleActive] = useState(false);
    const [isAutosActive, setIsAutosActive] = useState(false);
    const [isFoodDrinkActive, setIsFoodDrinkActive] = useState(false);
    const [isFinanceActive, setIsFinanceActive] = useState(false);
    const [isMusicActive, setIsMusicActive] = useState(false);
    const [isKidsActive, setIsKidsActive] = useState(false);
    const [isEntertainmentActive, setIsEntertainmentActive] = useState(false);
    const [isTravelActive, setIsTravelActive] = useState(false);
    const [isTvActive, setIsTvActive] = useState(false);

    const onChangeInputs = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onChangeInputsArray = async (e, isActive) => {
        if (!isActive) {
            setInputs({ ...inputs, interest_areas: [...inputs.interest_areas, e.target.value] })
        } else if (isActive) {
            setInputs({
                ...inputs,
                interest_areas: inputs.interest_areas.filter(item => item !== e.target.value)
            });
        }
    }

    const onChangeInputsBool = (e) => {
        let boolValue
        if (e.target.value === "Yes") {
            boolValue = true
        } else {
            boolValue = false
        }
        setInputs({ ...inputs, [e.target.name]: boolValue })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()

        try {
            const body = { username, firstName, lastName, email, password, interest_areas, wide_interest, topic_exclusions, trending_news };

            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const parseRes = await response.json();
            if (parseRes.data.token) {
                localStorage.setItem("token", parseRes.data.token);
                setAuth(true);
                notifySuccess(parseRes.message);
            } else {
                notifyError("An error occurred while registering your account.");
            }
        } catch (error) {
            console.error(error.message)
            notifyError("An error occurred while registering your account.");
        }
    }

    const [exclusionInput, setExclusionInput] = useState('');

    const handleInputChange = (event) => {
        setExclusionInput(event.target.value);
    };

    const handleSubmitExclusions = (e) => {
        e.preventDefault();
        if (exclusionInput === '') {
            return setExclusionInput('');
        } else {
            setInputs({ ...inputs, topic_exclusions: [...inputs.topic_exclusions, exclusionInput] })
            setExclusionInput('');
        }
    };

    return (
        <div id='register-page' className=''>
            {isDetail && (
                <>
                    <div className='details-container'>
                        <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                        <h1>Register</h1>
                        <form className='register-account-form' onSubmit={(e) => {
                            // onSubmitForm(e);
                            // navigate("/")
                            e.preventDefault();
                            setIsDetail(false);
                            setIsInterest(true);
                        }}>
                            <input type="text" name='firstName' placeholder='First Name' value={firstName} onChange={(e) => onChangeInputs(e)} />
                            <input type="text" name='lastName' placeholder='Last Name' value={lastName} onChange={(e) => onChangeInputs(e)} />
                            <input type="email" name='email' placeholder='Email Address*' required value={email} onChange={(e) => onChangeInputs(e)} />
                            <input type="text" name='username' placeholder='User Name*' required value={username} onChange={(e) => onChangeInputs(e)} />
                            <input type="password" name='password' placeholder='Password*' required value={password} onChange={(e) => onChangeInputs(e)} />
                            <button className='details-btn'>Continue</button>
                        </form>

                    </div>
                </>
            )
            }
            {isInterest &&
                <>
                    <div className='interest-container'>
                        <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                        <h1>What are your primary areas of interest?</h1>
                        <form className='register-account-form'>
                            <input className={isHealthActive ? 'active' : ''} type="button" value="Health" name='interest_areas' onClick={(e) => {
                                setIsHealthActive(!isHealthActive)
                                onChangeInputsArray(e, isHealthActive);
                            }} />
                            <input type="button" className={isSportsActive ? 'active' : ''} value="Sports" name='interest_areas' onClick={(e) => {
                                setIsSportsActive(!isSportsActive)
                                onChangeInputsArray(e, isSportsActive);
                            }} />
                            <input type="button" className={isNewsActive ? 'active' : ''} value="News" name='interest_areas' onClick={(e) => {
                                setIsNewsActive(!isNewsActive)
                                onChangeInputsArray(e, isNewsActive);
                            }} />
                            <input type="button" className={isWeatherActive ? 'active' : ''} value="Weather" name='interest_areas' onClick={(e) => {
                                onChangeInputsArray(e)
                                setIsWeatherActive(!isWeatherActive)
                                onChangeInputsArray(e, isWeatherActive)
                            }} />
                            <input type="button" className={isVideoActive ? 'active' : ''} value="Video" name='interest_areas' onClick={(e) => {
                                setIsVideoActive(!isVideoActive)
                                onChangeInputsArray(e, isVideoActive)
                            }} />
                            <input type="button" className={isMoviesActive ? 'active' : ''} value="Movies" name='interest_areas' onClick={(e) => {
                                setIsMoviesActive(!isMoviesActive)
                                onChangeInputsArray(e, isMoviesActive)
                            }} />
                            <input type="button" className={isLifestyleActive ? 'active' : ''} value="Lifestyle" name='interest_areas' onClick={(e) => {
                                setIsLifestyleActive(!isLifestyleActive)
                                onChangeInputsArray(e, isLifestyleActive)
                            }} />
                            <input type="button" className={isAutosActive ? 'active' : ''} value="Autos" name='interest_areas' onClick={(e) => {
                                setIsAutosActive(!isAutosActive)
                                onChangeInputsArray(e, isAutosActive)
                            }} />
                            <input type="button" className={isFoodDrinkActive ? 'active' : ''} value="Food and Drink" name='interest_areas' onClick={(e) => {
                                setIsFoodDrinkActive(!isFoodDrinkActive)
                                onChangeInputsArray(e, isFoodDrinkActive)
                            }} />
                            <input type="button" className={isFinanceActive ? 'active' : ''} value="Finance" name='interest_areas' onClick={(e) => {
                                setIsFinanceActive(!isFinanceActive)
                                onChangeInputsArray(e, isFinanceActive)
                            }} />
                            <input type="button" className={isMusicActive ? 'active' : ''} value="Music" name='interest_areas' onClick={(e) => {
                                setIsMusicActive(!isMusicActive)
                                onChangeInputsArray(e, isMusicActive)
                            }} />
                            <input type="button" className={isKidsActive ? 'active' : ''} value="Kids" name='interest_areas' onClick={(e) => {
                                setIsKidsActive(!isKidsActive)
                                onChangeInputsArray(e, isKidsActive)
                            }} />
                            <input type="button" className={isEntertainmentActive ? 'active' : ''} value="Entertainment" name='interest_areas' onClick={(e) => {
                                setIsEntertainmentActive(!isEntertainmentActive)
                                onChangeInputsArray(e, isEntertainmentActive)
                            }} />
                            <input type="button" className={isTravelActive ? 'active' : ''} value="Travel" name='interest_areas' onClick={(e) => {
                                setIsTravelActive(!isTravelActive)
                                onChangeInputsArray(e, isTravelActive)
                            }} />
                            <input type="button" className={isTvActive ? 'active' : ''} value="TV" name='interest_areas' onClick={(e) => {
                                setIsTvActive(!isTvActive)
                                onChangeInputsArray(e, isTvActive)
                            }} />
                        </form>
                        <button className='interest-btn'
                            onClick={(e) => {
                                // onSubmitForm(e);
                                // navigate("/")
                                e.preventDefault();
                                setIsInterest(false);
                                setWideIsInterest(true);
                            }}
                        >Continue</button>
                    </div>
                </>
            }
            {isWideInterest &&
                <>
                    <div className="wideInterest-container">
                        <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                        <h1>Would you like to recieve recommendations on a wide range of topics or prefer to focus on a few specific areas of wide interest</h1>
                        <form className='register-account-form' onSubmit={(e) => {
                            // onSubmitForm(e);
                            // navigate("/")
                        }}>
                            <input type="button" value="Yes" name='wide_interest'
                                onClick={(e) => {
                                    onChangeInputsBool(e)
                                    console.log("CLICKED: ", e.target.value)
                                    e.preventDefault();
                                    setWideIsInterest(false);
                                    setIsExclusions(true);
                                }}
                            />
                            <input type="button" value="No" name='wide_interest'
                                onClick={(e) => {
                                    onChangeInputsBool(e)
                                    console.log("CLICKED: ", e.target.value)
                                    e.preventDefault();
                                    setWideIsInterest(false);
                                    setIsExclusions(true);
                                }}
                            />
                        </form>

                    </div>
                </>
            }
            {isExclusions &&
                <>
                    <div className="exclusions-container">
                        <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                        <h1>Are there any specific topics or keywords you would like to exclude from your recommendations?</h1>
                        <form className='register-account-form' onSubmit={(e) => { e.preventDefault() }}>
                            <div className='exclusions-search'>
                                <input type="search" name="keywords" id="" placeholder='Enter specific keyword...' value={exclusionInput} onChange={handleInputChange} />
                                <button className='exclusions-btn'
                                    onClick={(e) => {
                                        handleSubmitExclusions(e)
                                    }}
                                ><i class="fa-solid fa-plus" style={{ color: '#fefffe' }}></i></button>
                            </div>

                            <button className='exclusions-btn'
                                onClick={(e) => {
                                    setIsExclusions(false);
                                    setIsTrendingImportant(true);
                                }}
                            >Continue</button>
                        </form>
                    </div>
                </>
            }
            {isTrendingImportant &&
                <>
                    <div className='trendingImportant-container'>
                        <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                        <h1>How Important is it for you to recieve news on trending or current events?</h1>
                        <form className='register-account-form' onSubmit={(e) => {
                            // onSubmitForm(e);
                            // navigate("/")
                            e.preventDefault();
                            setIsTrendingImportant(false);
                            setIsSubmit(true);
                        }}>
                            <input type="button" value="Very Important" name='trending_news'
                                onClick={(e) => {
                                    onChangeInputs(e)
                                    console.log("CLICKED: ", e.target.value)
                                    e.preventDefault();
                                    setIsTrendingImportant(false);
                                    setIsSubmit(true);
                                }}
                            />
                            <input type="button" value="Somewhat Important" name='trending_news'
                                onClick={(e) => {
                                    onChangeInputs(e)
                                    console.log("CLICKED: ", e.target.value)
                                    e.preventDefault();
                                    setIsTrendingImportant(false);
                                    setIsSubmit(true);
                                }}
                            />
                            <input type="button" value="Not Important" name='trending_news'
                                onClick={(e) => {
                                    onChangeInputs(e)
                                    console.log("CLICKED: ", e.target.value)
                                    e.preventDefault();
                                    setIsTrendingImportant(false);
                                    setIsSubmit(true);
                                }}
                            />
                        </form>
                    </div>
                </>
            }
            {isSubmit &&
                <>
                    <div className='submit-container'>
                        <img src={require("../assets/img/recome-light.png")} alt="Recome Logo Icon" />
                        <h1>You are all set! Have a great read</h1>
                        <form className='register-account-form' onSubmit={(e) => {
                            onSubmitForm(e);
                            navigate("/")
                        }}>
                            <button>Browse</button>
                        </form>
                    </div>
                </>
            }
        </div>


    )
}

export default Register