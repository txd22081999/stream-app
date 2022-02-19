import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import Lobby from './components/Lobby'
import Rooms from './components/Rooms'
import Stream from './components/Stream'
import { NavLink } from 'react-router-dom'
import { useUserStore } from './store'

const App = () => {
  const { userName } = useUserStore()
  const isAuthenticated = !!userName

  return (
    <BrowserRouter>
      <div className='App h-screen w-screen bg-black text-dark-white overflow-hidden'>
        <header className='w-full bg-gray-custom flex justify-between items-center px-8 py-2 mb-1'>
          <h1 className='text-3xl font-bold tracking-wide'>Strm</h1>

          <NavLink to='/'>Home</NavLink>
        </header>
        <Routes>
          <Route path='/' element={<Lobby />} />
          {isAuthenticated && (
            <>
              <Route path='/rooms' element={<Rooms />} />
              <Route path='/stream' element={<Stream />} />
            </>
          )}

          <Route path='*' element={<Navigate to={'/'} />} />
          {/* <ProtectedRoute
            path='/stream'
            component={<Stream />}
            redirectLink='/'
            isAuthenticated={userName !== ''}
          /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
