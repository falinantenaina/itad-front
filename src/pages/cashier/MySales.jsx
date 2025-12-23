import { Calendar } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useSaleStore } from "../../store/saleStore";

const MySales = () => {
  const { sales, fetchSalesHistory, isLoading } = useSaleStore();

  useEffect(() => {
    loadMySales();
  }, []);

  const loadMySales = async () => {
    try {
      await fetchSalesHistory({ limit: 100 });
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes");
    }
  };

  if (isLoading && sales.length === 0) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Mes ventes"
        description="Historique de vos ventes réalisées"
      />

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
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale) => (
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    {sale.paymentMethod?.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-green-600">
                      {sale.amount?.toLocaleString()} Ar
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune vente
            </h3>
            <p className="text-gray-600">
              Vous n'avez pas encore réalisé de vente
            </p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default MySales;
