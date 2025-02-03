import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/index.js"

function App() {

  return (
   <>
   <Navbar/>
    <Outlet />
   </>
  );
}

export default App;
