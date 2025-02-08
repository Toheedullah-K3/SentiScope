import React from 'react'
import wave from '../assets/images/wave.png'
import LoginBG from '../assets/images/LoginBG.svg'
import avatar from '../assets/images/avatar.svg'
import { Button, Input } from '../components/index.js'

const Signup = () => {

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
            <h2 className="my-4 text-white uppercase text-3xl">Join Us!</h2>


                <Input type="text" placeholder="Username" icon="user"/>

                <Input type="email" placeholder="Email" icon="envelope"/>

                <Input type="password" placeholder="Password" icon="lock"/>


            <Button type="submit" className="w-full mt-4 py-3 text-white uppercase font-bold rounded-lg">Sign Up</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Signup