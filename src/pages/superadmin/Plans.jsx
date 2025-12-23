import { Clock, DollarSign, Plus, Receipt, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import { usePlanStore } from "../../store/planStore";

const Plans = () => {
  const { plans, fetchPlans, createPlan, deletePlan, isLoading } =
    usePlanStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlan({
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
      });
      toast.success("Plan créé avec succès !");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      try {
        await deletePlan(id);
        toast.success("Plan supprimé");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Erreur lors de la suppression"
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", duration: "", price: "", description: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading && (!plans || plans.length === 0)) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Chargement des plans..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Plans tarifaires"
        description="Gérez vos différents plans de connexion"
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Nouveau plan
          </Button>
        }
      />

      {Array.isArray(plans) && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan._id} hover className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {plan.duration}h
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {plan.name}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{plan.duration} heures</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl">
                    {plan.price?.toLocaleString() || 0} Ar
                  </span>
                </div>
              </div>

              {plan.description && (
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              )}

              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => handleDelete(plan._id, plan.name)}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun plan
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre premier plan tarifaire
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Créer un plan
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Nouveau plan"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du plan"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Plan 5 heures"
            required
          />

          <Input
            label="Durée (heures)"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="5"
            min="1"
            required
          />

          <Input
            label="Prix (Ar)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="2000"
            min="0"
            required
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              rows="3"
              placeholder="Description du plan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Créer le plan
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

export default Plans;
