const SimplePieChart = ({ data = [], title = "Répartition" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune donnée à afficher
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  return (
    <div className="space-y-4">
      {/* Barres horizontales */}
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage =
            total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      colors[index % colors.length]
                    }`}
                  />
                  <span className="font-medium capitalize">
                    {item._id?.replace("_", " ") || "Non défini"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">
                    {item.count} ({percentage}%)
                  </span>
                  <span className="font-semibold text-green-600">
                    {item.totalAmount?.toLocaleString() || 0} Ar
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`${
                    colors[index % colors.length]
                  } h-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-900">{total} ventes</span>
            <span className="text-green-600">
              {data
                .reduce((sum, item) => sum + (item.totalAmount || 0), 0)
                .toLocaleString()}{" "}
              Ar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;
