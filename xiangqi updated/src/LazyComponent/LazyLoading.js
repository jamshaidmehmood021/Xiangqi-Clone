import React, { lazy } from 'react';
import { Bars } from 'react-loading-icons';

// Lazy load the components
const Home = lazy(() => import('../Pages/Home'));
const SignIn = lazy(() => import('../Pages/SignIn'));
const SignUp = lazy(() => import('../Pages/SignUp'));
const XiangqiBoard = lazy(() => import('../Pages/XiangqiBoard'));
const LandingPage = lazy(()=> import('../Pages/LandingPage.js'));

export const LazyHome = () => (
  <React.Suspense fallback={<div><Bars /></div>}>
    <Home />
  </React.Suspense>
);

export const LazySignIn = () => (
  <React.Suspense fallback={<div><Bars /></div>}>
    <SignIn />
  </React.Suspense>
);

export const LazySignUp = () => (
  <React.Suspense fallback={<div><Bars /></div>}>
    <SignUp />
  </React.Suspense>
);

export const LazyXiangqiBoard = () => (
  <React.Suspense fallback={<div><Bars /></div>}>
    <XiangqiBoard />
  </React.Suspense>
);

export const LazyLandingPage = () => (
  <React.Suspense fallback={<div><Bars /></div>}>
    <LandingPage />
  </React.Suspense>
);
