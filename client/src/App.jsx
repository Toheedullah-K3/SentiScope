import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/index.js"

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin, logout } from "./store/authSlice.js";


function App() {
  const authState = useSelector((state) => state.auth);
  console.log('Auth State:', authState);
  const apiUrl = import.meta.env.VITE_API_URL
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${apiUrl}/api/v1/users/current-user`);
        const {user} = response.data
        const userData = user
        if(userData){
          dispatch(authLogin({userData}));
        }

      } catch (error) {
        dispatch(logout());
      }finally{
        setLoading(false);
      }
    }
    fetchCurrentUser()
  }, []);

  return (
   <>
   <Navbar/>
    <Outlet />
   </>
  );
}

export default App;
