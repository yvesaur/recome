import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fetch from '../api/Fetch';
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

    const [isNewsActive, setIsNewsActive] = useState(false);
    const [isTvShowbizActive, setIsTvShowbizActive] = useState(false);
    const [isSportsActive, setIsSportsActive] = useState(false);
    const [isFemailActive, setIsFemailActive] = useState(false);
    const [isMoneyActive, setIsMoneyActive] = useState(false);
    const [isHealthActive, setIsHealthActive] = useState(false);
    const [isScienceTechActive, setIsScienceTechActive] = useState(false);
    const [isTravelActive, setIsTravelActive] = useState(false);
    const [isDebateActive, setIsDebateActive] = useState(false);
    const [isShoppingUkActive, setIsShoppingUkActive] = useState(false);
    const [isHomeActive, setIsHomeActive] = useState(false);
    const [isYourMoneyActive, setIsYourMoneyActive] = useState(false);
    const [isPropertyActive, setIsPropertyActive] = useState(false);
    const [isShoppingUsActive, setIsShoppingUsActive] = useState(false);
    const [isTvActive, setIsTvActive] = useState(false);
    const [isWellnessUsActive, setIsWellnessUsActive] = useState(false);
    const [isGalleriesActive, setIsGalleriesActive] = useState(false);
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [areAllCategoriesActive, setAreAllCategoriesActive] = useState(false);

    const onChangeInputs = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onChangeInputsArray = async (e, isActive) => {
        if (!isActive) {
            if (e.target.value === "ALL TOPIC") {
                setInputs({
                    ...inputs,
                    interest_areas: [...inputs.interest_areas,
                        "news", "tvshowbiz", "sport", "femail",
                        "money", "health", "sciencetech", "travel",
                        "debate", "shopping-uk", "home", "yourmoney",
                        "property", "shopping-us", "tv", "wellness-us",
                        "galleries", "video"]
                });
            } else {
                setInputs({ ...inputs, interest_areas: [...inputs.interest_areas, e.target.value] })
            }
        } else if (isActive) {
            if (e.target.value === "ALL TOPIC") {
                setInputs({ ...inputs, interest_areas: [] })
            } else {
                setInputs({
                    ...inputs,
                    interest_areas: inputs.interest_areas.filter(item => item !== e.target.value)
                });
            }
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

            const response = await Fetch.post("/auth/register", body, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.data.data.token) {
                localStorage.setItem("token", response.data.data.token);
                setAuth(true);
                notifySuccess(response.data.message);
                window.location.reload();
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

    const toggleAllCategories = () => {
        setAreAllCategoriesActive(!areAllCategoriesActive);
        setIsNewsActive(!areAllCategoriesActive);
        setIsTvShowbizActive(!areAllCategoriesActive);
        setIsSportsActive(!areAllCategoriesActive);
        setIsFemailActive(!areAllCategoriesActive);
        setIsMoneyActive(!areAllCategoriesActive);
        setIsHealthActive(!areAllCategoriesActive);
        setIsScienceTechActive(!areAllCategoriesActive);
        setIsTravelActive(!areAllCategoriesActive);
        setIsDebateActive(!areAllCategoriesActive);
        setIsShoppingUkActive(!areAllCategoriesActive);
        setIsHomeActive(!areAllCategoriesActive);
        setIsYourMoneyActive(!areAllCategoriesActive);
        setIsPropertyActive(!areAllCategoriesActive);
        setIsShoppingUsActive(!areAllCategoriesActive);
        setIsTvActive(!areAllCategoriesActive);
        setIsWellnessUsActive(!areAllCategoriesActive);
        setIsGalleriesActive(!areAllCategoriesActive);
        setIsVideoActive(!areAllCategoriesActive);
    }

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
                        <form className='register-account-form interest-options'>
                            <input type="button" className={areAllCategoriesActive ? 'active' : ''} value="ALL TOPIC" onClick={(e) => {
                                onChangeInputsArray(e, isNewsActive)
                                onChangeInputsArray(e, isTvShowbizActive)
                                onChangeInputsArray(e, isSportsActive)
                                onChangeInputsArray(e, isFemailActive)
                                onChangeInputsArray(e, isMoneyActive)
                                onChangeInputsArray(e, isHealthActive)
                                onChangeInputsArray(e, isScienceTechActive)
                                onChangeInputsArray(e, isTravelActive)
                                onChangeInputsArray(e, isDebateActive)
                                onChangeInputsArray(e, isShoppingUkActive)
                                onChangeInputsArray(e, isHomeActive)
                                onChangeInputsArray(e, isYourMoneyActive)
                                onChangeInputsArray(e, isPropertyActive)
                                onChangeInputsArray(e, isShoppingUsActive)
                                onChangeInputsArray(e, isTvActive)
                                onChangeInputsArray(e, isWellnessUsActive)
                                onChangeInputsArray(e, isGalleriesActive)
                                onChangeInputsArray(e, isVideoActive)
                                toggleAllCategories()
                            }} />
                            <input type="button" className={isNewsActive ? 'active' : ''} value="news" name='interest_areas' onClick={(e) => {
                                setIsNewsActive(!isNewsActive)
                                onChangeInputsArray(e, isNewsActive);
                            }} />
                            <input type="button" className={isTvShowbizActive ? 'active' : ''} value="tvshowbiz" name='interest_areas' onClick={(e) => {
                                setIsTvShowbizActive(!isTvShowbizActive)
                                onChangeInputsArray(e, isTvShowbizActive);
                            }} />
                            <input type="button" className={isSportsActive ? 'active' : ''} value="sport" name='interest_areas' onClick={(e) => {
                                setIsSportsActive(!isSportsActive)
                                onChangeInputsArray(e, isSportsActive);
                            }} />
                            <input type="button" className={isFemailActive ? 'active' : ''} value="femail" name='interest_areas' onClick={(e) => {
                                onChangeInputsArray(e)
                                setIsFemailActive(!isFemailActive)
                                onChangeInputsArray(e, isFemailActive)
                            }} />
                            <input type="button" className={isMoneyActive ? 'active' : ''} value="money" name='interest_areas' onClick={(e) => {
                                setIsMoneyActive(!isMoneyActive)
                                onChangeInputsArray(e, isMoneyActive)
                            }} />
                            <input type="button" className={isHealthActive ? 'active' : ''} value="health" name='interest_areas' onClick={(e) => {
                                setIsHealthActive(!isHealthActive)
                                onChangeInputsArray(e, isHealthActive)
                            }} />
                            <input type="button" className={isScienceTechActive ? 'active' : ''} value="sciencetech" name='interest_areas' onClick={(e) => {
                                setIsScienceTechActive(!isScienceTechActive)
                                onChangeInputsArray(e, isScienceTechActive)
                            }} />
                            <input type="button" className={isTravelActive ? 'active' : ''} value="travel" name='interest_areas' onClick={(e) => {
                                setIsTravelActive(!isTravelActive)
                                onChangeInputsArray(e, isTravelActive)
                            }} />
                            <input type="button" className={isDebateActive ? 'active' : ''} value="debate" name='interest_areas' onClick={(e) => {
                                setIsDebateActive(!isDebateActive)
                                onChangeInputsArray(e, isDebateActive)
                            }} />
                            <input type="button" className={isShoppingUkActive ? 'active' : ''} value="shopping-uk" name='interest_areas' onClick={(e) => {
                                setIsShoppingUkActive(!isShoppingUkActive)
                                onChangeInputsArray(e, isShoppingUkActive)
                            }} />
                            <input type="button" className={isHomeActive ? 'active' : ''} value="home" name='interest_areas' onClick={(e) => {
                                setIsHomeActive(!isHomeActive)
                                onChangeInputsArray(e, isHomeActive)
                            }} />
                            <input type="button" className={isYourMoneyActive ? 'active' : ''} value="yourmoney" name='interest_areas' onClick={(e) => {
                                setIsYourMoneyActive(!isYourMoneyActive)
                                onChangeInputsArray(e, isYourMoneyActive)
                            }} />
                            <input type="button" className={isPropertyActive ? 'active' : ''} value="property" name='interest_areas' onClick={(e) => {
                                setIsPropertyActive(!isPropertyActive)
                                onChangeInputsArray(e, isPropertyActive)
                            }} />
                            <input type="button" className={isShoppingUsActive ? 'active' : ''} value="shopping-us" name='interest_areas' onClick={(e) => {
                                setIsShoppingUsActive(!isShoppingUsActive)
                                onChangeInputsArray(e, isShoppingUsActive)
                            }} />
                            <input type="button" className={isTvActive ? 'active' : ''} value="tv" name='wellness-uk' onClick={(e) => {
                                setIsTvActive(!isTvActive)
                                onChangeInputsArray(e, isTvActive)
                            }} />
                            <input type="button" className={isWellnessUsActive ? 'active' : ''} value="wellness-us" name='interest_areas' onClick={(e) => {
                                setIsWellnessUsActive(!isWellnessUsActive)
                                onChangeInputsArray(e, isWellnessUsActive)
                            }} />
                            <input type="button" className={isGalleriesActive ? 'active' : ''} value="galleries" name='interest_areas' onClick={(e) => {
                                setIsGalleriesActive(!isGalleriesActive)
                                onChangeInputsArray(e, isGalleriesActive)
                            }} />
                            <input type="button" className={isVideoActive ? 'active' : ''} value="video" name='interest_areas' onClick={(e) => {
                                setIsVideoActive(!isVideoActive)
                                onChangeInputsArray(e, isVideoActive)
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
                        <h1>Would you like to receive recommendations on a wide range of topics or prefer to focus on a few specific areas of wide interest</h1>
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
                                <input
                                    type="search"
                                    name="keywords"
                                    id=""
                                    placeholder='Enter specific keyword...'
                                    value={exclusionInput}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => {
                                        if (e.key === ' ') {
                                            e.preventDefault();
                                        }
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            if (topic_exclusions.includes(e.target.value)) {
                                                notifyError("Keyword already exists!")
                                            } else {
                                                handleSubmitExclusions(e)
                                            }
                                        }

                                    }}
                                />
                            </div>

                            <div className='excluded-topic-container'>
                                {topic_exclusions &&
                                    topic_exclusions.map((topic, index) => {
                                        return (
                                            <>
                                                <div className='excluded-topic'>
                                                    <p>
                                                        {topic}
                                                    </p>
                                                    <i class="fa-solid fa-xmark" style={{ color: "#fefffe" }}
                                                        onClick={() => {
                                                            const currentTopics = topic_exclusions.filter(topicItem => topicItem !== topic);
                                                            setInputs({ ...inputs, topic_exclusions: currentTopics });
                                                        }

                                                        }
                                                    >
                                                    </i>
                                                </div>
                                            </>
                                        )
                                    })
                                }
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
                        <h1>How Important is it for you to receive news on trending or current events?</h1>
                        <form className='register-account-form' onSubmit={(e) => {
                            // onSubmitForm(e);
                            // navigate("/")
                            e.preventDefault();
                            setIsTrendingImportant(false);
                            setIsSubmit(true);
                        }}>
                            <input type="button" value="Important" name='trending_news'
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