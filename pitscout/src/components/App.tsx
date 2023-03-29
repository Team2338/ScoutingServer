import React, { useEffect } from 'react';
import './App.scss';
import { initApp, selectIsLoggedIn, useAppDispatch, useAppSelector } from '../state/';
import Header from './header/Header';
import MainPage from './main-page/MainPage';
import LoginPage from './login-page/LoginPage';

function App() {
  const isLoggedIn: boolean = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(
    () => {
      dispatch(initApp());
    },
    [dispatch]
  );

  return (
    <div className="App">
      <Header />
      { isLoggedIn ? <MainPage/> : <LoginPage/> }
    </div>
  );
}

export default App;
