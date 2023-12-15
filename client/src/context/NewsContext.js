import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Fetch from "../api/Fetch";

export const NewsContext = createContext();

export const NewsContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [latestNews, setLatestNews] = useState([]);
  const [trendingNews, setTrendingNews] = useState([]);
  const [trendingNewsClicks, setTrendingNewsClicks] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [userClickedNews, setUserClickedNews] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`;
    return formattedDate;
  }

  async function getCurrentUserID() {
    try {
      const response = await fetch("http://localhost:5000/api/v1/getuserinfo", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      // console.log(parseRes)
      setCurrentUserID(parseRes.data.userid);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Fetch.get("/getTrendingNews");

        console.log(response);
        setTrendingNews(response.data.data.news);
        setTrendingNewsClicks(response.data.data.newsClicks);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Fetch.get("/news");
        setLatestNews(response.data.data.news);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const notifySuccess = async (text) =>
    toast.success(text, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyError = async (text) =>
    toast.error(text, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();
      parseRes.data === true
        ? setIsAuthenticated(true)
        : setIsAuthenticated(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  const getUserClick = async (newClick) => {
    if (isAuthenticated) {
      let clickHistory = localStorage.getItem("click_history") || "";
      let impressions = localStorage.getItem("impressions") || "";

      localStorage.setItem("click_history", clickHistory + " " + newClick);
      localStorage.setItem("impressions", impressions + `${newClick}-1 `);
    }
  };

  const getUserImpression = async (newsList) => {
    if (isAuthenticated) {
      for (let key in newsList) {
        if (newsList.hasOwnProperty(key)) {
          console.log("USER IMPRESSION: ", newsList[key].id);
          let impressions = localStorage.getItem("impressions");
          localStorage.setItem(
            "impressions",
            impressions + `${newsList[key].id}-0 `
          );
        }
      }
    }
  };

  return (
    <NewsContext.Provider
      value={{
        notifySuccess,
        notifyError,
        isAuth,
        setAuth,
        isAuthenticated,
        setIsAuthenticated,
        latestNews,
        trendingNews,
        getUserClick,
        getUserImpression,
        trendingNewsClicks,
        getCurrentUserID,
        currentUserID,
        setCurrentUserID,
        formatDate,
        userClickedNews,
      }}
    >
      {props.children}
    </NewsContext.Provider>
  );
};
