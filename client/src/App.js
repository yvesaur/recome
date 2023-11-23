import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

/* COMPONENTS EXPORTS */
import About from "./pages/About";
import Archive from "./pages/Archive";
import CookiePolicy from "./pages/CookiePolicy";
import Home from "./pages/Home";
import Latest from "./pages/Latest";
import Recommended from "./pages/Recommended";
import TermsAndConditions from "./pages/TermsAndConditions";
import Trending from "./pages/Trending";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/latest" element={<Latest />}></Route>
          <Route exact path="/recommended" element={<Recommended />}></Route>
          <Route exact path="/trending" element={<Trending />}></Route>

          <Route exact path="/about" element={<About />}></Route>
          <Route exact path="/archive" element={<Archive />}></Route>
          <Route
            exact
            path="/termsandconditions"
            element={<TermsAndConditions />}
          ></Route>
          <Route exact path="/cookiepolicy" element={<CookiePolicy />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
