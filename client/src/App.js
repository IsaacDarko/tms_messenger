import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import { Routes } from 'react-router-dom';
import Login from './Components/Login';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import StartChatModal from './Components/StartChatModal';

import { GlobalContext } from './Contexts/GlobalContext';


function App() {
  const {isAuthenticated} = useContext(GlobalContext);

  return isAuthenticated ? (

    //using the BEM naming convention
    <div className="app">

      <div className="app__body">
        <StartChatModal />
        <Sidebar  />
        <Chat />
      </div>

    </div>

  ) : (
    <Login />
  )
}

export default App;
