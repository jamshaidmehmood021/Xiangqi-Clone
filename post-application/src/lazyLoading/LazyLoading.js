import React, { lazy } from 'react';
import { Bars } from 'react-loading-icons';


const SignIn = lazy(() => import('pages/signIn'));
const SignUp = lazy(() => import('pages/signUp'));
const AddPost = lazy(() => import('pages/addPost'));
const Home = lazy(() => import('pages/home'));
const Profile = lazy(() => import('pages/profile'));
const Drawer = lazy(() => import('components/drawer'));

export const LazySignIn = () => (
  <React.Suspense fallback={<Bars stroke="#98ff98"/>}>
    <SignIn />
  </React.Suspense>
);

export const LazySignUp = () => (
  <React.Suspense fallback={<Bars stroke="#98ff98"/>}>
    <SignUp />
  </React.Suspense>
);

export const LazyAddPost = () => (
  <React.Suspense fallback={<Bars stroke="#98ff98"/>}>
    <AddPost />
  </React.Suspense>
);

export const LazyHome = () => (
  <React.Suspense fallback={<Bars stroke="#98ff98"/>}>
    <Home />
  </React.Suspense>
);

export const LazyProfile = () => (
  <React.Suspense fallback={<Bars stroke="#98ff98"/>}>
    <Profile />
  </React.Suspense>
);

export const LazyDrawer = () => (
  <React.Suspense fallback={<Bars stroke="#98ff98"/>}>
    <Drawer />
  </React.Suspense>
);