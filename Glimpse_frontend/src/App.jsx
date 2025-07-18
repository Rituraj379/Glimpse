import './App.css'
import React from 'react'
import { Routes, Route , Navigate} from 'react-router-dom'
import Home from './container/Home'
import Login from './components/Login'

function App() {
  console.log('App render');
  return (
    <>
      {console.log('Rendering Routes in App')}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  )
}

export default App