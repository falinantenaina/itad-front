// src/pages/superadmin/CashierStats.jsx
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Download,
  ShoppingCart,
  TrendingUp,
  User,
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
import { useCashierStore } from "../../store/cashierStore";
import { useSaleStore } from "../../store/saleStore";

const CashierStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cashiers, fetchCashiers } = useCashierStore();
  const {
    stats,
    fetchSalesStats,
    sales,
    fetchSalesHistory,
    getCashierStats,
    isLoading,
  } = useSaleStore();
  const [period, setPeriod] = useState("day");
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [cashierSpecificStats, setCashierSpecificStats] = useState(null);

  const cashier = cashiers.find((c) => c._id === id);

  // Utiliser useCallback pour les fonctions
  const loadStats = useCallback(async () => {
    if (!id) return;

    try {
      const params = {
        period,
        cashierId: id,
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
        cashierId: id,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement des ventes");
    }
  }, [id, fetchSalesHistory]);

  const loadCashierSpecificStats = useCallback(async () => {
    if (!id) return;

    try {
      const params = {
        cashierId: id,
        period,
      };

      if (period === "custom" && customDates.startDate && customDates.endDate) {
        params.startDate = customDates.startDate;
        params.endDate = customDates.endDate;
      }

      const result = await getCashierStats(params);
      setCashierSpecificStats(result);
    } catch (error) {
      console.error("Erreur statistiques caissier:", error);
    }
  }, [id, period, customDates, getCashierStats]);

  // Charger les caissiers au montage
  useEffect(() => {
    if (!cashiers || cashiers.length === 0) {
      fetchCashiers();
    }
  }, [cashiers, fetchCashiers]);

  // Charger les stats quand les dépendances changent
  useEffect(() => {
    loadStats();
    loadSales();
    loadCashierSpecificStats();
  }, [loadStats, loadSales, loadCashierSpecificStats]);

  const handleCustomDateChange = (field, value) => {
    setCustomDates((prev) => ({ ...prev, [field]: value }));
  };

  const exportToCSV = () => {
    if (!sales || sales.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const headers = [
      "Date",
      "Code",
      "Plan",
      "Point de vente",
      "Paiement",
      "Montant",
    ];
    const rows = sales.map((sale) => [
      new Date(sale.createdAt).toLocaleString("fr-FR"),
      sale.ticketId?.code || "N/A",
      sale.planId?.name || "N/A",
      sale.pointOfSaleId?.name || "N/A",
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
    link.download = `ventes_${cashier?.username || "caissier"}_${
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
          onClick={() => navigate("/cashiers")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux caissiers
        </Button>

        <PageHeader
          title={`Statistiques - ${cashier?.username || "Chargement..."}`}
          description={
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-600">{cashier?.email}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {cashier?.pointOfSaleId?.name}
              </span>
            </div>
          }
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

      {/* Informations du caissier */}
      <Card className="mb-6 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {cashier?.username}
            </h3>
            <p className="text-gray-600">{cashier?.email}</p>
            <p className="text-sm text-gray-500">
              Point de vente:{" "}
              <span className="font-semibold">
                {cashier?.pointOfSaleId?.name}
              </span>
            </p>
          </div>
        </div>
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

      {/* Performance du caissier */}
      {cashierSpecificStats && (
        <Card className="mb-6">
          <h3 className="text-xl font-bold mb-4">Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 mb-1">Total des ventes</div>
              <div className="text-2xl font-bold text-blue-900">
                {cashierSpecificStats.stats?.totalSales || 0}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 mb-1">Revenu généré</div>
              <div className="text-2xl font-bold text-green-900">
                {cashierSpecificStats.stats?.totalRevenue?.toLocaleString() ||
                  0}{" "}
                Ar
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 mb-1">
                Revenu complété
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {cashierSpecificStats.stats?.completedRevenue?.toLocaleString() ||
                  0}{" "}
                Ar
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Évolution temporelle */}
      {stats?.timeline && stats.timeline.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-xl font-bold mb-4">Évolution des ventes</h3>
          <SimpleBarChart data={stats.timeline} label="Ventes" />
        </Card>
      )}

      {/* Répartition par méthode de paiement */}
      {stats?.paymentMethods && stats.paymentMethods.length > 0 && (
        <Card className="mb-6">
          <h3 className="text-xl font-bold mb-4">
            Méthodes de paiement utilisées
          </h3>
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
                    colSpan="5"
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

export default CashierStats;
