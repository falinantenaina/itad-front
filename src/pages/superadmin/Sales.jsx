import { Calendar, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Select from "../../components/ui/Select";
import { useCashierStore } from "../../store/cashierStore";
import { usePOSStore } from "../../store/posStore";
import { useSaleStore } from "../../store/saleStore";

const Sales = () => {
  const { sales, fetchSalesHistory, isLoading } = useSaleStore();
  const { pointsOfSale, fetchPointsOfSale } = usePOSStore();
  const { cashiers, fetchCashiers } = useCashierStore();

  const [filters, setFilters] = useState({
    pointOfSaleId: "",
    cashierId: "",
  });

  const loadSales = async () => {
    try {
      await fetchSalesHistory({
        limit: 100,
        pointOfSaleId: filters.pointOfSaleId || undefined,
        cashierId: filters.cashierId || undefined,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes");
    }
  };

  useEffect(() => {
    fetchPointsOfSale();
    fetchCashiers();
    loadSales();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadSales();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  if (isLoading && (!sales || sales.length === 0)) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Chargement des ventes..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Historique des ventes"
        description="Consultez toutes les ventes réalisées"
      />

      {/* Filtres */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold">Filtres:</span>
          </div>

          <Select
            options={[
              { value: "", label: "Tous les points de vente" },
              ...(pointsOfSale || []).map((pos) => ({
                value: pos._id,
                label: pos.name,
              })),
            ]}
            value={filters.pointOfSaleId}
            onChange={(e) =>
              handleFilterChange("pointOfSaleId", e.target.value)
            }
            className="w-64"
          />

          <Select
            options={[
              { value: "", label: "Tous les caissiers" },
              ...(cashiers || []).map((cashier) => ({
                value: cashier._id,
                label: cashier.username,
              })),
            ]}
            value={filters.cashierId}
            onChange={(e) => handleFilterChange("cashierId", e.target.value)}
            className="w-64"
          />
        </div>
      </Card>

      {/* Table des ventes */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Point de vente
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Caissier
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(sales) && sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(sale.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-primary-600">
                        {sale.ticketId?.code || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sale.planId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sale.pointOfSaleId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sale.cashierId?.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {sale.paymentMethod?.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">
                        {sale.amount?.toLocaleString() || 0} Ar
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isLoading ? "Chargement..." : "Aucune vente trouvée"}
                    </h3>
                    <p className="text-gray-600">
                      {isLoading
                        ? "Veuillez patienter..."
                        : "Aucune vente ne correspond aux filtres sélectionnés"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};
export default Sales;
