import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

/* COMPONENTS EXPORTS */
import About from "./pages/About";
import Archive from "./pages/Archive";
import CookiePolicy from "./pages/CookiePolicy";
import Home from "./pages/Home";
import TermsAndConditions from "./pages/TermsAndConditions";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
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
