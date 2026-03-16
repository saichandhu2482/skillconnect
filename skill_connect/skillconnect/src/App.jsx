import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Workers from './pages/Workers'
import WorkerSignup from './pages/WorkerSignup'
import WorkerDetail from './pages/WorkerDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyBookings from './pages/MyBookings'

export default function App() {
  const [lang, setLang] = useState('en')

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <Routes>
        <Route path="/" element={<Home lang={lang} />} />
        <Route path="/workers" element={<Workers lang={lang} />} />
        <Route path="/workers/:id" element={<WorkerDetail lang={lang} />} />
        <Route path="/join" element={<WorkerSignup lang={lang} />} />
        <Route path="/login" element={<Login lang={lang} />} />
        <Route path="/signup" element={<Signup lang={lang} />} />
        <Route path="/bookings" element={<MyBookings />} />
      </Routes>
      <Footer />
    </>
  )
}