import { createRoot } from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './assets/styles/style.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store/store.js'

// pages
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { AuthLayout } from './components/index.js'

const routes = createRoutesFromElements(
  <Route element={<App />}>
    <Route path="/" element={<Home />} />
    <Route
      path="/login"
      element={
        <AuthLayout authentication={false}>
          <Login />
        </AuthLayout>
      }
    />
    <Route
      path="/signup"
      element={
        <AuthLayout authentication={false}>
          <Signup />
        </AuthLayout>
      }
    />
    <Route
      path="/user-profile"
      element={
        <AuthLayout authentication>
          <UserProfile />
        </AuthLayout>
      }
    />
    <Route
      path="/dashboard"
      element={
        <AuthLayout authentication>
          <Dashboard />
        </AuthLayout>
      }
    />
  </Route>
)

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />,
    </PersistGate>
  </Provider>
)
