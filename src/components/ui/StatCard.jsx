const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "from-primary-500 to-secondary-500",
    green: "from-green-400 to-emerald-500",
    orange: "from-orange-400 to-amber-500",
    red: "from-red-400 to-pink-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-2xl mb-4`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default StatCard;
