import React from "react"
import Login from "./components/Login"
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Home from "./Home"
import ChatPage from './components/ChatPage';
import FriendsList from "./components/friendslist"
import socketIO from 'socket.io-client';
import './index.css'

const socket = socketIO.connect('http://localhost:8081');


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login socket={socket}/>}> </Route>
        <Route path='/signup' element={<Signup />}> </Route>
        <Route path='/home' element={<Home />}> </Route>
        <Route path='friends' element={<FriendsList />}> </Route>
        <Route path="/chat" element={<ChatPage socket={socket} userID={localStorage.getItem('')}/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;