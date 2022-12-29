import React, { useEffect, useState, useContext } from 'react';
import '../App.css';
import { Routes } from 'react-router-dom';
import Login from './users/Login';
import Chat from './users/Chat';
import Sidebar from './users/Sidebar';
import StartChatModal from './users/StartChatModal';

import { GlobalContext } from '../Contexts/GlobalContext';


function UserApp() {
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

export default UserApp;
