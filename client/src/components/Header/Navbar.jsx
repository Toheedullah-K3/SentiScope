import React from 'react'
import LogoImage from '../../assets/images/logo.svg'
import { Button } from '../index.js'


const Navbar = () => {
    const navItems = [
        {
            name: 'Home',
            slug: '/'
        },
        {
            name: 'Login',
            slug: '/login'
        },
        {
            name: 'Signup',
            slug: '/signup'
        },
        {
            name: 'User Profile',
            slug: '/user-profile'
        }
    ]
    return (
        <nav className='py-4'>
            <div className="container">
                <div className="grid grid-cols-2 border border-white/15 rounded-full p-2 px-4 items-center">
                    <div>
                        <img src={LogoImage} alt="Logo Image" className='h-9 w-auto ml-2' />
                    </div>
                    <div className='flex justify-end'>
                        <Button variant='secondary'>Log In</Button>
                        <Button>Sign Up</Button>
                        
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-menu md:hidden"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar