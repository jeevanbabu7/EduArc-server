import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Reg from "./pages/Reg/Reg.jsx";
import Query from "./pages/Query/Query.jsx";
import Subject from "./pages/Subject.jsx";
import QuizPage from "./pages/Quiz/QuizPage.jsx";


const App = () => {
  return (
    <Router>
      <div className="container justify-center" style={{ margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Self-closing */}
          <Route path='/auth' element={<Auth />} /> {/* Self-closing */}
          <Route path='/Register' element={<Reg />} />
          <Route path="/query" element={<Query />}/>
          <Route path="/subject/:name" element={<Subject />}/>
          <Route path="/subject/:name/quiz" element={<QuizPage />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
