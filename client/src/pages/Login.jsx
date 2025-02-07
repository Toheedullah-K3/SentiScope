import React, { useEffect } from 'react'
import wave from '../assets/images/wave.png'
import LoginBG from '../assets/images/LoginBG.svg'
import avatar from '../assets/images/avatar.svg'
import { Button } from '../components/index.js'

const Login = () => {

  return (
    <section>
      <img className="hidden xl:block fixed bottom-0 left-0 h-full -z-10" src={wave} />
      <div className="w-screen h-screen grid grid-cols-1 xl:grid-cols-2 gap-28 px-8">
        <div className="hidden xl:flex justify-end items-center">
          <img src={LoginBG} className='w-[500px]' />
        </div>
        <div className="flex justify-center items-center text-center xl:justify-start">
          <form className='w-[360px] p-6 rounded-lg shadow-lg'>
            <img src={avatar} className='h-[100px] mx-auto' alt="avatar" />
            <h2 className="my-4 text-white uppercase text-3xl">Welcome Back!</h2>


            {/* ---------------- */}



            {/* ---------------- */}

            <div className="input-div relative flex items-center border-b-2 border-gray-300 py-2 my-0">
              <i className="fas fa-user text-lime-400 mr-2"></i>
              <div className="w-full relative">
                {/* <h5 className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-lg transition-all">Username</h5> */}
                <input type="text" placeholder="Username" className="w-full bg-transparent outline-none text-white text-lg pl-2" />
              </div>
            </div>

            <div className="input-div relative flex items-center border-b-2 border-gray-300 py-2 my-4">
              <i className="fas fa-lock text-lime-400 mr-2"></i>
              <div className="w-full relative">
                <input type="password" placeholder="Password" className="w-full bg-transparent outline-none text-white text-lg pl-2" />
              </div>
            </div>

            <a href="#" className="block text-right text-white text-sm hover:text-lime-400 transition">Forgot Password?</a>
            <Button type="submit" className="w-full mt-4 py-3 text-white uppercase font-bold rounded-lg hover:bg-lime-500 transition">Login</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login