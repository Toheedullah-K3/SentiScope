import { NavLink } from 'react-router-dom'
import LogoImage from '../../assets/images/logo.png'
import { Button } from '../index.js'
import { useSelector } from 'react-redux'

const Navbar = () => {

    const authStatus = useSelector(state => state.auth.status)



    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true
        },
        {
            name: 'About',
            slug: '/about-us',
            active: true
        },
        {
            name: 'Trending',
            slug: '/signup',
            active: true
        },
        {
            name: 'Highlights',
            slug: '/user-profile',
            active: true
        }
    ]
    return (
        <nav className='py-4 lg:py-8'>
            <div className="container max-w-5xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-3 border border-white/15 rounded-full p-2 px-4 md:pr-2 items-center">
                    <div>
                        <img
                            src={LogoImage}
                            alt="Logo Image"
                            className='h-4 md:h-12 w-auto'
                        />
                        <h2 className='text-white'>{authStatus}</h2>
                    </div>
                    <div className='hidden lg:flex justify-center align-center'>
                        <ul className='flex gap-6 font-medium'>
                            {navItems.map((item) => (
                                item.active ? (
                                    <li key={item.slug}>
                                        <NavLink
                                            to={item.slug}
                                            className={({ isActive }) => isActive ? 'text-lime-400' : 'text-white hover:text-lime-400'}
                                        >
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ) : null
                            ))}
                        </ul>
                    </div>
                    <div className='flex justify-end gap-4'>
                        {authStatus && (
                            <>
                                <NavLink to='/dashboard'>
                                    <Button className='hidden lg:inline-flex items-center font-extrabold'>Dashboard</Button>
                                </NavLink>

                                <NavLink to='/logout'>
                                    <Button className='hidden lg:inline-flex items-center font-extrabold'>Logout</Button>
                                </NavLink>
                            </>
                        )}
                        {!authStatus && (
                            <>
                                <NavLink to='/login'>
                                    <Button variant='secondary' className='hidden lg:inline-flex items-center'>Log In</Button>
                                </NavLink>

                                <NavLink to='/signup'>
                                    <Button className='hidden lg:inline-flex items-center'>Sign Up</Button>
                                </NavLink></>
                        )}


                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-menu lg:hidden"
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