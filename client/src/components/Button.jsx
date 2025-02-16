import React from 'react'

const Button = ({
    children,
    type= "submit",
    variant = "primary",
    className = "", 
    ...otherProps
}) => {
    const baseStyles = "px-6 py-2 rounded-full font-medium cursor-pointer"
    const variantStyle = {
        primary: "bg-lime-400 text-neutral-950 border-lime-400 hover:bg-lime-500 transition", 
        secondary: "border border-white text-white bg-transparent",
        danger: "bg-red-600 text-white border-red-600"
    }
  return (
    <button className= {`${type} ${baseStyles} ${variantStyle[variant]} ${className}`} {...otherProps}>
        {children}
    </button>
  )
}

export default Button