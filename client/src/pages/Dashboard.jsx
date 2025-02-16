import { useSelector } from 'react-redux'
import { Chart } from '@/components/Chart'
import { Button } from "@/components/ui/button"

const Dashboard = () => {
  const user = useSelector((state) => state.auth.userData)

  return (
    <>
    <h1 className='text-9xl'>{user.username}</h1>
    <h2 className='text-6xl'>{user.email}</h2>
    <Button>Click me</Button>
    <Chart />
    </>
  )
} 

export default Dashboard