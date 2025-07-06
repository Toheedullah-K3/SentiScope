const Button = ({
  children,
  type = "submit",
  variant = "primary",
  className = "",
  ...otherProps
}) => {
  const baseStyles =
    "px-6 py-2 rounded-full font-medium cursor-pointer transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyle = {
    primary:
      "bg-gradient-to-tr from-lime-400 to-green-500 text-neutral-900 hover:from-green-400 hover:to-lime-500 hover:shadow-lg",
    secondary:
      "border border-white text-white bg-transparent hover:bg-white/10",
    danger:
      "bg-red-600 text-white border border-red-600 hover:bg-red-700",
    glass:
      "bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 hover:text-lime-400",
    ghost:
      "bg-transparent text-gray-300 hover:text-white hover:bg-white/10",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyle[variant]} ${className}`}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
