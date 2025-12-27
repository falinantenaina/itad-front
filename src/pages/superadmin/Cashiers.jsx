import {
  Mail,
  Plus,
  Store,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import { useCashierStore } from "../../store/cashierStore";
import { usePOSStore } from "../../store/posStore";

const Cashiers = () => {
  const navigate = useNavigate();
  const { cashiers, fetchCashiers, createCashier, deleteCashier, isLoading } =
    useCashierStore();
  const { pointsOfSale, fetchPointsOfSale } = usePOSStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    pointOfSaleId: "",
  });

  useEffect(() => {
    fetchCashiers();
    fetchPointsOfSale();
  }, [fetchCashiers, fetchPointsOfSale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCashier(formData);
      toast.success("Caissier créé avec succès !");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    }
  };

  const handleDelete = async (id, username) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${username}" ?`)) {
      try {
        await deleteCashier(id);
        toast.success("Caissier supprimé");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Erreur lors de la suppression"
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      pointOfSaleId: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading && (!cashiers || cashiers.length === 0)) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Chargement des caissiers..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Caissiers"
        description="Gérez vos caissiers et leurs affectations"
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Nouveau caissier
          </Button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Caissier
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Point de vente
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(cashiers) && cashiers.length > 0 ? (
                cashiers.map((cashier) => (
                  <tr key={cashier._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {cashier.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {cashier.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {cashier.pointOfSaleId?.name || "Non assigné"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={cashier.isActive ? "success" : "danger"}>
                        {cashier.isActive ? (
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            Actif
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <UserX className="w-3 h-3" />
                            Inactif
                          </span>
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/cashiers/${cashier._id}/stats`)
                          }
                        >
                          Statistiques
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleDelete(cashier._id, cashier.username)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucun caissier
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Commencez par créer votre premier caissier
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      <Plus className="w-5 h-5" />
                      Créer un caissier
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Création */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Nouveau caissier"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Jean Dupont"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean.dupont@example.com"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Select
            label="Point de vente"
            name="pointOfSaleId"
            value={formData.pointOfSaleId}
            onChange={handleChange}
            options={[
              { value: "", label: "Sélectionner un point de vente" },
              ...(pointsOfSale || []).map((pos) => ({
                value: pos._id,
                label: pos.name,
              })),
            ]}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Créer le caissier
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Cashiers;
