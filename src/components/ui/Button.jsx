import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
    outline:
      "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 disabled:opacity-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
