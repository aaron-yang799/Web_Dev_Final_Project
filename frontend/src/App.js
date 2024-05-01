import React from "react"
import Login from "./Login"
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Home from "./Home"
import FriendsList from "./components/friendslist"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}> </Route>
        <Route path='/signup' element={<Signup />}> </Route>
        <Route path='/home' element={<Home />}> </Route>
        <Route path='friends' element={<FriendsList />}> </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
