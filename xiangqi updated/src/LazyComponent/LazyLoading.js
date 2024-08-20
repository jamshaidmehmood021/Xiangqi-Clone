import React, { lazy } from 'react';
import { Bars } from 'react-loading-icons';

const Home = lazy(() => import('../Pages/Home'));
const SignIn = lazy(() => import('../Pages/SignIn'));
const SignUp = lazy(() => import('../Pages/SignUp'));
const XiangqiBoard = lazy(() => import('../Pages/XiangqiBoard'));
const LandingPage = lazy(()=> import('../Pages/LandingPage.js'));

export const LazyHome = () => (
  <React.Suspense fallback={<Bars />}>
    <Home />
  </React.Suspense>
);

export const LazySignIn = () => (
  <React.Suspense fallback={<Bars />}>
    <SignIn />
  </React.Suspense>
);

export const LazySignUp = () => (
  <React.Suspense fallback={<Bars />}>
    <SignUp />
  </React.Suspense>
);

export const LazyXiangqiBoard = () => (
  <React.Suspense fallback={<Bars />}>
    <XiangqiBoard />
  </React.Suspense>
);

export const LazyLandingPage = () => (
  <React.Suspense fallback={<Bars />}>
    <LandingPage />
  </React.Suspense>
);
