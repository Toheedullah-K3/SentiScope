import React from 'react'

const Input = React.forwardRef(function Input({
    type = 'text',
    placeholder = 'Enter text',
    className = '',
    ...props
}, ref) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none text-white text-lg pl-2 ${className}`}
            ref={ref}
            {...props}

        />
    )
})

export default Input