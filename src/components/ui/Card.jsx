const Card = ({ children, className = "", hover = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${
        hover ? "hover:shadow-xl transition-shadow duration-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
