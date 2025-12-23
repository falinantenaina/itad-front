import { Loader2 } from "lucide-react";

const Button = ({
  children,
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-primary px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
