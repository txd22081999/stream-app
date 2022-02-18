import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import Lobby from './components/Lobby'
import Rooms from './components/Rooms'
import Stream from './components/Stream'
import { useStore } from './store'

const App = () => {
  const { userName } = useStore()
  const isAuthenticated = !!userName

  console.log('Here')

  console.log(process.env.REACT_APP_API_KEY)

  return (
    <BrowserRouter>
      <div className='App h-full'>
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
