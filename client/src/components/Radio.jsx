import React from "react"

const Radio = React.forwardRef(function Radio({
    type = 'radio',
    label,
    name = "option",
    className = '',
    ...props
}, ref) {
    return (
        <div>
            <label>
                <input type={type} ref={ref} name={name} {...props} className="hidden peer" />
                <div className={`
                        flex items-center justify-center  h-10 px-10 rounded-full cursor-pointer border border-white/15 peer-checked:bg-lime-500 peer-checked:text-white 
                            ${className}
                    `}>{label}</div>
            </label>
        </div>
    )
})

export default Radio