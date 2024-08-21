import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'App.css';

import {
  LazyHome,
  LazyXiangqiBoard,
  LazyLandingPage,
  LazySignUp,
  LazySignIn
} from 'LazyComponent/LazyLoading.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LazyLandingPage />} />
        <Route path="/auth" element={<LazyHome  />} >
            <Route path="signUp" element={<LazySignUp />} />
            <Route path="signIn" element={<LazySignIn />} />
        </Route>
        <Route path="/board" element={<LazyXiangqiBoard />} />
      </Routes>
    </Router>
  )
}

export default App;
