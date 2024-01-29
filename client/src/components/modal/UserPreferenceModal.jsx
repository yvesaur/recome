
import React, { useContext, useState } from 'react';
import Select from "react-select";
import Fetch from '../../api/Fetch';
import "../../assets/css/modal/userpreferencemodal.css";
import { NewsContext } from '../../context/NewsContext';

const UserPreferenceModal = ({
    currentUserID,
    isDialogOpen,
    closeDialog,
    interestAreas,
    setInterestAreas,
    wideInterest,
    setWideInterest,
    topicExclusions,
    setTopicExclusions,
    isTrendingNews,
    setIsTrendingNews,
    appSelectedModel,
    setAppSelectedModel
}) => {
    const { notifyError, notifySuccess } = useContext(NewsContext);

    const topicOptions = [
        { value: 'all', label: 'All' },
        { value: 'news', label: 'News' },
        { value: 'tvshowbiz', label: 'TV Showbiz' },
        { value: 'sport', label: 'Sport' },
        { value: 'femail', label: 'Femail' },
        { value: 'money', label: 'Money' },
        { value: 'health', label: 'Health' },
        { value: 'sciencetech', label: 'Science and Tech' },
        { value: 'travel', label: 'Travel' },
        { value: 'debate', label: 'Debate' },
        { value: 'shopping-uk', label: 'Shopping UK' },
        { value: 'home', label: 'Home' },
        { value: 'yourmoney', label: 'Your Money' },
        { value: 'property', label: 'Property' },
        { value: 'shopping-us', label: 'Shopping US' },
        { value: 'wellness-uk', label: 'Wellness UK' },
        { value: 'wellness-us', label: 'Wellness US' },
        { value: 'galleries', label: 'Galleries' },
        { value: 'video', label: 'Video' },
        { value: 'bestbuys', label: 'Best buys' },
    ];

    const [pickedRecommendationModel, setPickedRecommendationModel] = useState("recome")

    const handleChange = (e) => {
        setIsTrendingNews(e.target.value);
    }

    const deleteInterest = (selectedInterest) => {
        const newInterestAreas = interestAreas.filter(interest => interest !== selectedInterest);
        setInterestAreas(newInterestAreas);
    }

    const deleteExclusion = (selectedExclusion) => {
        const newTopicExclusions = topicExclusions.filter(exclusion => exclusion !== selectedExclusion);
        setTopicExclusions(newTopicExclusions);
    }

    const addExclusion = (e) => {
        const newTopicExclusions = [...topicExclusions, e.target.value]
        setTopicExclusions(newTopicExclusions)
    }

    const addInterest = (selectedOption) => {
        if (selectedOption.value === 'all') {
            // Add all options
            const newInterestAreas = topicOptions
                .filter(option => option.value !== 'all')
                .map(option => option.value);
            setInterestAreas(newInterestAreas);
        } else {
            // Add selected option
            const newInterestAreas = [...interestAreas, selectedOption.value]
            if (interestAreas.includes(selectedOption.value)) {
                notifyError("Interest already exists!")
            } else {
                setInterestAreas(newInterestAreas)
            }
        }
    }

    const updateUserPreference = async () => {
        try {
            setAppSelectedModel(pickedRecommendationModel);
            const body = { interest_areas: interestAreas, wide_interest: wideInterest, topic_exclusions: topicExclusions, trending_news: isTrendingNews };

            const response = await Fetch.patch(`/user/editpreference/${currentUserID}`, body, {
                headers: { "Content-Type": "application/json" }
            });

            notifySuccess("User preference updated successfully.")

        } catch (error) {
            notifyError("An error occurred while updating user preferences.")
            console.log(error.message)
        }
    }

    return (
        <div
            id='user-preference-modal'
            className={`${isDialogOpen ? "block" : "hidden"}`}
        >
            <dialog
                id='user-preference-dialog'
                open={isDialogOpen}
                onClose={closeDialog}
                className="w-[500px] h-[500px] overflow-auto rounded-lg p-10 fixed top-[25%]"
            >
                <i onClick={closeDialog} class="fa-regular fa-circle-xmark"></i>
                <p className='preference-header'>Your personalized user preferences: </p>
                <div>
                    <label htmlFor='interest-areas'>Areas of interest: </label>
                    <div>
                        <div id='interest-areas' className='options-container'>
                            {interestAreas &&
                                interestAreas.map((interest, index) => {
                                    return (
                                        <>
                                            <div className='selected-options'>
                                                {interest}
                                                <i
                                                    class="fa-solid fa-xmark"
                                                    style={{ color: "#fefffe" }}
                                                    onClick={() => deleteInterest(interest)}
                                                >
                                                </i>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                        <Select
                            className='select-topic'
                            options={topicOptions}
                            placeholder="Select topic..."
                            menuPortalTarget={document.body}
                            onChange={selectedOption => {
                                addInterest(selectedOption)
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label >Wide recommendations: </label>
                    <label class="toggle" for="readButton">
                        <input
                            value="true"
                            className="toggle__input"
                            type="checkbox"
                            id="readButton"
                            checked={wideInterest}
                            onChange={() => setWideInterest(!wideInterest)}
                        />
                        <div class="toggle__fill"></div>
                    </label>
                </div>
                <div>
                    <label htmlFor='topic-exclusions'>Topic Exclusions: </label>
                    <div>
                        <div id='topic-exclusions' className='options-container'>
                            {topicExclusions &&
                                topicExclusions.map((exclusion, index) => {
                                    return (
                                        <>
                                            <div className='selected-options excluded-topics'>
                                                {exclusion}
                                                <i
                                                    class="fa-solid fa-xmark"
                                                    style={{ color: "#fefffe" }}
                                                    onClick={() => deleteExclusion(exclusion)}
                                                >
                                                </i>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                        <input
                            type="search"
                            name="keywords"
                            id="add-exclusions"
                            placeholder='Add a keyword...'
                            onKeyPress={(e) => {
                                if (e.key === ' ') {
                                    e.preventDefault();
                                }
                                if (e.key === 'Enter') {
                                    if (topicExclusions.includes(e.target.value)) {
                                        notifyError("Keyword already exists!")
                                    } else {
                                        addExclusion(e);
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                <div>
                    <label >Trending News recommendation? </label>
                    <select className='trending-news-select' value={isTrendingNews} onChange={(e) => handleChange(e)}>
                        <option value="Important">Important</option>
                        <option value="Not Important">Not Important</option>
                    </select>
                </div>

                <div>
                    <label >Select a Recommendation Model </label>
                    <select className='recommendation-news-select' value={pickedRecommendationModel} onChange={(e) => setPickedRecommendationModel(e.target.value)}>
                        <option value="recome">RECOME</option>
                        <option value="lstur">LSTUR</option>
                        <option value="naml">NAML</option>
                        <option value="dkn">DKN</option>
                    </select>
                </div>
                <button
                    onClick={() => {
                        updateUserPreference()
                        closeDialog()
                    }}
                    className='save-changes-btn'
                >SAVE CHANGES</button>
            </dialog>
        </div>
    )
}

export default UserPreferenceModal