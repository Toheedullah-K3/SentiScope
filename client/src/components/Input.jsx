import React from 'react'

const Input = React.forwardRef(function Input({
    type = 'text',
    placeholder = 'Enter text',
    icon = 'check',
    className = '',
    ...props
}, ref) {
    return (
        // <div className='flex items-center border-b-2 border-gray-300 py-2 my-4'>
        <>
            <i className={`fas fa-${icon} text-lime-400 mr-2`}></i>
            <input
                type={type}
                placeholder={placeholder}
                className={`w-full bg-transparent outline-none text-white text-lg pl-2 ${className}`}
                ref={ref}
                {...props}

            />
        </>
        // </div>
    )
})

export default Input