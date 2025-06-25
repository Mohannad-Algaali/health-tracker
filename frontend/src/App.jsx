/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Link,BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import './App.css'
import './index.css'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function App() {

  const [isLight, setIsLight] = useState(false)
  const changeTheme = ()=>{
    isLight?document.body.classList.add('light'): document.body.classList.remove('light')
    setIsLight(l=> !l)
  }

  return (
    <>
     
      <Router>
         {/* <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav> */}

      <button onClick={changeTheme}>Theme</button>

      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
      </Routes>
      </Router>
    </>
  )
}

export default App
