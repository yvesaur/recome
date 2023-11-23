import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

/* COMPONENTS EXPORTS */
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
