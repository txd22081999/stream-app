import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import Lobby from './components/Lobby'
import Rooms from './components/Rooms'
import Main from './components/Main'
import { NavLink } from 'react-router-dom'
import { useUserStore } from './store'
import ReactTooltip from 'react-tooltip'
import { AiTwotoneHome } from 'react-icons/ai'
import StreamLogo from 'images/streaming.png'

const App = () => {
  const { userName } = useUserStore()
  const isAuthenticated = !!userName

  return (
    <BrowserRouter>
      <div className='App h-screen w-screen bg-black text-dark-white flex flex-col overflow-x-hidden'>
        <header className='w-full bg-gray-custom flex justify-between items-center px-8 py-1 mb-1'>
          <NavLink to='/' data-tip='Lobby'>
            <div className='flex items-center'>
              <img src={StreamLogo} alt='logo' className='w-12 mr-2' />
              <h1 className='text-3xl' style={{ fontFamily: 'Target' }}>
                Strix
              </h1>
            </div>
          </NavLink>

          <NavLink to='/' data-tip='Lobby'>
            <button className='text-sm px-2 py-2 bg-input rounded-md'>
              <AiTwotoneHome className='text-xl' />
            </button>
          </NavLink>
          <ReactTooltip />
        </header>

        <div className='flex-1 bg-black'>
          <Routes>
            <Route path='/' element={<Lobby />} />
            {isAuthenticated && (
              <>
                <Route path='/rooms' element={<Rooms />} />
                <Route path='/stream' element={<Main />} />
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
      </div>
    </BrowserRouter>
  )
}

export default App
