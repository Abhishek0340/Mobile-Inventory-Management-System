import React from 'react'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './Components/NotFound'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Loading from './Components/Loading'
import AuthProvider from "./Context/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";


const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'))
const Inventory = lazy(() => import('./Pages/Inventory'))
const Billing = lazy(() => import('./Pages/Billing'))
const Orders = lazy(() => import('./Pages/Orders'))
const Report = lazy(() => import('./Pages/Report'))
const Settings = lazy(() => import('./Pages/Settings'))


function App() {
  return (
    <>

      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
               <Route element={<PrivateRoute />}>  
                <Route path="/home" element={<AdminDashboard />} />
                <Route path='inventory' element={<Inventory />} />
                <Route path='billing' element={<Billing />} />
                <Route path='orders' element={<Orders />} />
                <Route path='report' element={<Report />} />
                <Route path="settings" element={<Settings />} />
                <Route path='*' element={<NotFound />} />
                <Route path='/loading' element={<Loading />} />
               </Route>  
            </Routes>
          </AuthProvider>
        </Suspense>
      </BrowserRouter>

    </>
  )
}

export default App