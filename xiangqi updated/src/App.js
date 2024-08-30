import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'App.css';

import {
  LazyHome,
  LazyXiangqiBoard,
  LazyLandingPage,
  LazySignUp,
  LazySignIn,
  LazyGamePage
} from 'LazyComponent/LazyLoading.js';

import ProtectedRoute from 'Components/ProtectedRoute';
import ErrorBoundary from 'ErrorBoundries/ErrorBoundries';

const App = () => {

  return (
    <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/" element={<LazyLandingPage />} />
        <Route path="/auth" element={<LazyHome />} >
          <Route path="signUp" element={<LazySignUp />} />
          <Route path="signIn" element={<LazySignIn />} />
        </Route>
        <Route 
          path="/board/:game_id?" 
          element={<ProtectedRoute element={LazyXiangqiBoard} />} 
        />
        <Route 
          path="/game" 
          element={<ProtectedRoute element={LazyGamePage} />} 
        />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
};

export default App;
