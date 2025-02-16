import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/index.js"

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login as authLogin, logout } from "./store/authSlice.js";
import { ThemeProvider } from "@/components/theme-provider"


function App() {
  const apiUrl = import.meta.env.VITE_API_URL
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${apiUrl}/api/v1/users/current-user`);
        const { user } = response.data
        const userData = user
        if (userData) {
          dispatch(authLogin({ userData }));
        }

      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, apiUrl]);


  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser]);

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Outlet />
      </ThemeProvider>
    </>
  );
}

export default App;
