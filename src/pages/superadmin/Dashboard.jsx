// src/pages/superadmin/Dashboard.jsx
import {
  CheckCircle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Select from "../../components/ui/Select";
import StatCard from "../../components/ui/StatCard";
import { usePOSStore } from "../../store/posStore";
import { useSaleStore } from "../../store/saleStore";

const Dashboard = () => {
  const { stats, fetchSalesStats, sales, fetchSalesHistory, isLoading } =
    useSaleStore();
  const { pointsOfSale, fetchPointsOfSale } = usePOSStore();
  const [period, setPeriod] = useState("day");
  const [selectedPOS, setSelectedPOS] = useState("");

  const loadStats = async () => {
    try {
      await fetchSalesStats({
        period,
        pointOfSaleId: selectedPOS || undefined,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des statistiques");
    }
  };

  const loadRecentSales = async () => {
    try {
      await fetchSalesHistory({
        limit: 10,
        pointOfSaleId: selectedPOS || undefined,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes");
    }
  };

  useEffect(() => {
    fetchPointsOfSale();
    loadStats();
    loadRecentSales();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadStats();
    loadRecentSales();
  }, [period, selectedPOS]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading && !stats) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble de vos ventes et statistiques"
      />

      {/* Filtres */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex gap-2">
          <Button
            variant={period === "day" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setPeriod("day")}
          >
            Aujourd'hui
          </Button>
          <Button
            variant={period === "week" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setPeriod("week")}
          >
            Cette semaine
          </Button>
          <Button
            variant={period === "month" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setPeriod("month")}
          >
            Ce mois
          </Button>
        </div>

        <Select
          options={[
            { value: "", label: "Tous les points de vente" },
            ...(pointsOfSale || []).map((pos) => ({
              value: pos._id,
              label: pos.name,
            })),
          ]}
          value={selectedPOS}
          onChange={(e) => setSelectedPOS(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign />}
          label="Revenu total"
          value={`${stats?.summary?.totalRevenue?.toLocaleString() || 0} Ar`}
          color="blue"
        />
        <StatCard
          icon={<ShoppingCart />}
          label="Tickets vendus"
          value={stats?.summary?.totalSales || 0}
          color="green"
        />
        <StatCard
          icon={<CheckCircle />}
          label="Ventes complétées"
          value={stats?.summary?.completedSales || 0}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Ticket moyen"
          value={`${Math.round(stats?.summary?.averageSaleAmount || 0)} Ar`}
          color="red"
        />
      </div>

      {/* Ventes récentes */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Ventes récentes</h2>
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
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Vérifier que sales existe et est un tableau */}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">
                        {sale.amount?.toLocaleString() || 0} Ar
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {isLoading
                      ? "Chargement..."
                      : "Aucune vente pour le moment"}
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

export default Dashboard;
