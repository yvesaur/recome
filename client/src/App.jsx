import React, { useContext, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./AppMobile.css";
import "./AppTablet.css";

/* COMPONENTS EXPORTS */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NewsContext, NewsContextProvider } from "./context/NewsContext";
import About from "./pages/About";
import Archive from "./pages/Archive";
import CookiePolicy from "./pages/CookiePolicy";
import DataPrivacy from "./pages/DataPrivacy";
import Home from "./pages/Home";
import Latest from "./pages/Latest";
import Login from "./pages/Login";
import NewsDetail from "./pages/NewsDetail";
import Recommended from "./pages/Recommended";
import Register from "./pages/Register";
import TermsAndConditions from "./pages/TermsAndConditions";
import Trending from "./pages/Trending";
import UserDashboard from "./pages/UserDashboard";

import dknLogoDark from '../src/assets/img/dkn-dark.png';
import dknLogo from '../src/assets/img/dkn-light.png';
import lsturLogoDark from '../src/assets/img/lstur-dark.png';
import lsturLogo from '../src/assets/img/lstur-light.png';
import namlLogoDark from '../src/assets/img/naml-dark.png';
import namlLogo from '../src/assets/img/naml-light.png';
import recomeLogoDark from '../src/assets/img/recome-dark.png';
import recomeLogo from '../src/assets/img/recome-light.png';

function App() {
  const [appSelectedModel, setAppSelectedModel] = useState("recome");

  const MODEL_LOGOS = {
    "recome": recomeLogo,
    "lstur": lsturLogo,
    "naml": namlLogo,
    "dkn": dknLogo,
  };

  const MODEL_LOGOS_DARK = {
    "recome": recomeLogoDark,
    "lstur": lsturLogoDark,
    "naml": namlLogoDark,
    "dkn": dknLogoDark,
  };

  const modelLogo = MODEL_LOGOS[appSelectedModel];
  const modelLogoDark = MODEL_LOGOS_DARK[appSelectedModel];

  return (
    <NewsContextProvider>

      <div className={`App-${appSelectedModel}`}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route exact path="/latest" element={<Latest modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route exact path="/recommended" element={<Recommended modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route exact path="/trending" element={<Trending modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>

            <Route exact path="/register" element={<Register modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route exact path="/login" element={<Login modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route
              exact
              path="/user/:id/dashboard"
              element={<UserDashboard appSelectedModel={appSelectedModel} setAppSelectedModel={setAppSelectedModel} modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}
            ></Route>

            <Route exact path="/about" element={<About modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route exact path="/archive" element={<Archive modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route
              exact
              path="/termsandconditions"
              element={<TermsAndConditions modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}
            ></Route>
            <Route exact path="/dataprivacy" element={<DataPrivacy modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}></Route>
            <Route
              exact
              path="/cookiepolicy"
              element={<CookiePolicy modelLogo={modelLogo} modelLogoDark={modelLogoDark} />}
            ></Route>
            <Route exact path="/news/:id" element={<NewsDetail modelLogo={modelLogo} modelLogoDark={modelLogoDark} appSelectedModel={appSelectedModel} />}></Route>
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </div>
    </NewsContextProvider>
  );

  /*
  function LoginRoute() {
    return !isAuthenticated ? (
      <Login setAuth={setAuth} />
    ) : (
      <Navigate to="/dashboard" />
    );
  }
  */
}

export default App;
