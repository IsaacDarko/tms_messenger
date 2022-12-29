import React from 'react';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom';
import {UserApp, AdminApp} from './Components';
import { GlobalContext } from './Contexts/GlobalContext';


function App() {
  return (

      <Routes>
        < Route exact path='/' element={<UserApp/>} />
        < Route exact path='/admin' element={<AdminApp />} />
      </Routes>

  )
}

export default App;
