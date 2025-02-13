import React from 'react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector((state) => state.auth.userData)

  return (
    <h1 className='text-9xl'>Dashboard</h1>
  )
} 

export default Dashboard