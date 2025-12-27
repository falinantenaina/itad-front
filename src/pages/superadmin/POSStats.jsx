// src/pages/superadmin/POSStats.jsx
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Download,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SimpleBarChart from "../../components/ui/SimpleBarChart";
import SimplePieChart from "../../components/ui/SimplePieChart";
import StatCard from "../../components/ui/StatCard";
import { usePOSStore } from "../../store/posStore";
import { useSaleStore } from "../../store/saleStore";

const POSStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pointsOfSale, fetchPointsOfSale } = usePOSStore();
  const { stats, fetchSalesStats, sales, fetchSalesHistory, isLoading } =
    useSaleStore();
  const [period, setPeriod] = useState("day");
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });

  const pos = pointsOfSale.find((p) => p._id === id);

  // Utiliser useCallback pour les fonctions
  const loadStats = useCallback(async () => {
    if (!id) return;

    try {
      const params = {
        period,
        pointOfSaleId: id,
      };

      if (period === "custom" && customDates.startDate && customDates.endDate) {
        params.startDate = customDates.startDate;
        params.endDate = customDates.endDate;
      }

      await fetchSalesStats(params);
    } catch (error) {
      toast.error("Erreur lors du chargement des statistiques");
    }
  }, [id, period, customDates, fetchSalesStats]);

  const loadSales = useCallback(async () => {
    if (!id) return;

    try {
      await fetchSalesHistory({
        limit: 50,
        pointOfSaleId: id,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes");
    }
  }, [id, fetchSalesHistory]);

  // Charger les points de vente au montage
  useEffect(() => {
    if (!pointsOfSale || pointsOfSale.length === 0) {
      fetchPointsOfSale();
    }
  }, [pointsOfSale, fetchPointsOfSale]);

  // Charger les stats quand id, period ou customDates change
  useEffect(() => {
    loadStats();
    loadSales();
  }, [loadStats, loadSales]);

  const handleCustomDateChange = (field, value) => {
    setCustomDates((prev) => ({ ...prev, [field]: value }));
  };

  const exportToCSV = () => {
    if (!sales || sales.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const headers = ["Date", "Code", "Plan", "Caissier", "Paiement", "Montant"];
    const rows = sales.map((sale) => [
      new Date(sale.createdAt).toLocaleString("fr-FR"),
      sale.ticketId?.code || "N/A",
      sale.planId?.name || "N/A",
      sale.cashierId?.username || "N/A",
      sale.paymentMethod || "N/A",
      sale.amount || 0,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ventes_${pos?.name || "pos"}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    toast.success("Export réussi !");
  };

  if (isLoading && !stats) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Chargement des statistiques..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate("/pos")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux points de vente
        </Button>

        <PageHeader
          title={`Statistiques - ${pos?.name || "Chargement..."}`}
          description={pos?.location}
          action={
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-5 h-5" />
              Exporter CSV
            </Button>
          }
        />
      </div>

      {/* Filtres de période */}
      <Card className="mb-6">
        <h3 className="font-semibold mb-4">Période</h3>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={period === "day" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setPeriod("day")}
          >
            <Calendar className="w-4 h-4" />
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
          <Button
            variant={period === "custom" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setPeriod("custom")}
          >
            Personnalisé
          </Button>
        </div>

        {period === "custom" && (
          <div className="mt-4 flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date début
              </label>
              <input
                type="date"
                value={customDates.startDate}
                onChange={(e) =>
                  handleCustomDateChange("startDate", e.target.value)
                }
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date fin</label>
              <input
                type="date"
                value={customDates.endDate}
                onChange={(e) =>
                  handleCustomDateChange("endDate", e.target.value)
                }
                className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Statistiques globales */}
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
          icon={<TrendingUp />}
          label="Ventes complétées"
          value={stats?.summary?.completedSales || 0}
          color="orange"
        />
        <StatCard
          icon={<DollarSign />}
          label="Ticket moyen"
          value={`${Math.round(stats?.summary?.averageSaleAmount || 0)} Ar`}
          color="red"
        />
      </div>

      {/* Graphique temporel */}
      {stats?.timeline && stats.timeline.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-xl font-bold mb-4">Évolution des ventes</h3>
          <SimpleBarChart data={stats.timeline} label="Ventes" />
        </Card>
      )}

      {/* Répartition par méthode de paiement */}
      {stats?.paymentMethods && stats.paymentMethods.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-xl font-bold mb-4">Méthodes de paiement</h3>
          <SimplePieChart
            data={stats.paymentMethods}
            title="Répartition des paiements"
          />
        </Card>
      )}

      {/* Ventes récentes */}
      <Card>
        <h3 className="text-xl font-bold mb-4">Ventes récentes</h3>
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
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Aucune vente pour cette période
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

export default POSStats;
