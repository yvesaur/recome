import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "./AppMobile.css";
import "./AppTablet.css";

/* COMPONENTS EXPORTS */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NewsContextProvider } from "./context/NewsContext";
import About from "./pages/About";
import Archive from "./pages/Archive";
import CookiePolicy from "./pages/CookiePolicy";
import Home from "./pages/Home";
import Latest from "./pages/Latest";
import Login from "./pages/Login";
import NewsDetail from "./pages/NewsDetail";
import Recommended from "./pages/Recommended";
import Register from "./pages/Register";
import TermsAndConditions from "./pages/TermsAndConditions";
import Trending from "./pages/Trending";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <NewsContextProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/latest" element={<Latest />}></Route>
            <Route exact path="/recommended" element={<Recommended />}></Route>
            <Route exact path="/trending" element={<Trending />}></Route>

            <Route exact path="/register" element={<Register />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route
              exact
              path="/user/:id/dashboard"
              element={<UserDashboard />}
            ></Route>

            <Route exact path="/about" element={<About />}></Route>
            <Route exact path="/archive" element={<Archive />}></Route>
            <Route
              exact
              path="/termsandconditions"
              element={<TermsAndConditions />}
            ></Route>
            <Route
              exact
              path="/cookiepolicy"
              element={<CookiePolicy />}
            ></Route>
            <Route exact path="/news/:id" element={<NewsDetail />}></Route>
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
