import React, { useState } from 'react'
import { Button, Input } from '../components/index.js'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'

// images import
import wave from '../assets/images/wave.png'
import LoginBG from '../assets/images/LoginBG.svg'
import avatar from '../assets/images/avatar.svg'

const Signup = () => {
    const [user, setUser] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_API_URL

    const createUser = async (data) => {
      setError("")
        try {
          setLoading(true)
          const response = await axios.post(`${apiUrl}/api/v1/users/register`, data)
          setUser(response.data)
          navigate('/login')
        } catch (error) {
          setError(error.response.data.message || "An unexpected error occurred.");
        } finally {
          setLoading(false)
        }
    }
  return ( 
    <section>
      <img className="hidden xl:block fixed bottom-0 left-0 h-full -z-10" src={wave} />
      <div className="w-screen h-screen grid grid-cols-1 xl:grid-cols-2 gap-28 px-8">
        <div className="hidden xl:flex justify-end items-center">
          <img src={LoginBG} className='w-[500px]' />
        </div>
        <div className="flex justify-center items-center text-center xl:justify-start">

        

          <form 
            onSubmit={handleSubmit(createUser)}
            className='w-[360px] p-6 rounded-lg shadow-lg'
          >
            <img src={avatar} className='h-[100px] mx-auto' alt="avatar" />
            <h2 className="my-4 text-white uppercase text-3xl">Join Us!</h2>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <Input 
                  type="text" 
                  placeholder="Username" 
                  icon="user"
                  {...register('username', {required: true})}
                />

                <Input 
                  type="email"
                  placeholder="Email" 
                  icon="envelope"
                  {...register('email', {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Enter valid email address",
                    },
                  })}
                />

                <Input 
                  type="password" 
                  placeholder="Password" 
                  icon="lock"
                  {...register('password', {required: true})}
                />

                  
            <Button type="submit" className="w-full mt-4 py-3 text-white uppercase font-bold rounded-lg">
              {loading ? 'Loading' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Signup