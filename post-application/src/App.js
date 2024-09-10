import React from 'react';
import {  Routes, Route } from 'react-router-dom';

import { LazySignIn, LazySignUp, LazyAddPost, LazyHome, LazyProfile, LazyDrawer } from 'lazyLoading/LazyLoading';
import ProtectedRoute from 'components/protectedRoute';

import ErrorBoundary from 'errorBoundary';

const App = () => {

  return (
    <ErrorBoundary>
        <LazyDrawer />
        <Routes>
          <Route path="/" element={<LazySignIn />} />
          <Route path="/signup" element={<LazySignUp />} />
          <Route path="/addPost" element={<ProtectedRoute element={LazyAddPost} />} />
          <Route path="/home" element={<ProtectedRoute element={LazyHome} />} />
          <Route path="/profile/:email" element={<ProtectedRoute element={LazyProfile} />} />
        </Routes>
    </ErrorBoundary>
  );
};

export default App;
