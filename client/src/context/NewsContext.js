import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

export const NewsContext = createContext();

export const NewsContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const notifySuccess = (text) =>
    toast.success(text, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyError = (text) =>
    toast.error(text, {
      position: "top-right",
      autoClose: 2000,
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

  return (
    <NewsContext.Provider
      value={{
        notifySuccess,
        notifyError,
        isAuth,
        setAuth,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {props.children}
    </NewsContext.Provider>
  );
};
