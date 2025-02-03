import React from 'react'
import { createRoot } from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

// pages
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import UserProfile from './pages/UserProfile.jsx'


const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/user-profile" element={<UserProfile />} />
  </Route>
)

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
