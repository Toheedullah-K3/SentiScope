import React from 'react'

const Button = ({
    children,
    variant = "primary",
    className = "",
    ...otherProps
}) => {
    const baseStyles = "px-6 py-2 rounded-full font-medium"
    const variantStyle = {
        primary: "bg-lime-400 text-neutral-950 border-lime-400", 
        secondary: "border border-white text-white bg-transparent",
        danger: "bg-red-600 text-white border-red-600"
    }
  return (
    <button className= {`${baseStyles} ${variantStyle[variant]} ${className}`} {...otherProps}>
        {children}
    </button>
  )
}

export default Button