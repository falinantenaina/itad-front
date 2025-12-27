// src/components/ui/SimpleBarChart.jsx

const SimpleBarChart = ({ data = [], label = "Ventes" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune donnée à afficher
      </div>
    );
  }

  // Trouver la valeur maximale pour normaliser les barres
  const maxValue = Math.max(...data.map((item) => item.totalSales || 0));

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.totalSales / maxValue) * 100 : 0;

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{item._id}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{item.totalSales} ventes</span>
                <span className="font-semibold text-green-600">
                  {item.totalRevenue?.toLocaleString() || 0} Ar
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                style={{ width: `${height}%` }}
              >
                {height > 15 && (
                  <span className="text-xs font-semibold text-white">
                    {item.totalSales}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleBarChart;
