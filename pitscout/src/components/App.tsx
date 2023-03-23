import React from 'react';
import './App.scss';
import { useAppSelector } from '../state/';
import MainPage from './main-page/MainPage';
import LoginPage from './login-page/LoginPage';

function App() {
  const isLoggedIn: boolean = useAppSelector(state => state.loadStatus === 'success');

  return (
    <div className="App">
      { isLoggedIn ? <MainPage/> : <LoginPage/> }
    </div>
  );
}

export default App;
