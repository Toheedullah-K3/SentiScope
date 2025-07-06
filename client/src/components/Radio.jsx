import React from "react";

const Radio = React.forwardRef(function Radio({
  type = "radio",
  label,
  name = "option",
  className = "",
  ...props
}, ref) {
  return (
    <label className="relative inline-block cursor-pointer select-none">
      <input
        type={type}
        name={name}
        ref={ref}
        {...props}
        className="peer hidden"
      />
      <div
        className={`
          px-6 py-2 text-sm font-medium rounded-full border
          border-white/15 bg-white/5 text-gray-300
          peer-checked:bg-gradient-to-tr peer-checked:from-lime-400 peer-checked:to-green-500 peer-checked:text-gray-900
          hover:bg-white/10 transition duration-200
          ${className}
        `}
      >
        {label}
      </div>
    </label>
  );
});

export default Radio;
