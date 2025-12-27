import { MapPin, Plus, Server, Store, Trash2, TrendingUp } from "lucide-react";
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
import { usePOSStore } from "../../store/posStore";

const PointsOfSale = () => {
  const navigate = useNavigate();
  const { pointsOfSale, fetchPointsOfSale, createPOS, deletePOS, isLoading } =
    usePOSStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    host: "",
    user: "",
    password: "",
  });

  useEffect(() => {
    fetchPointsOfSale();
  }, [fetchPointsOfSale]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPOS({
        name: formData.name,
        location: formData.location,
        mikrotikConfig: {
          host: formData.host,
          user: formData.user,
          password: formData.password,
        },
      });
      toast.success("Point de vente créé avec succès !");
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
        await deletePOS(id);
        toast.success("Point de vente supprimé");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Erreur lors de la suppression"
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      host: "",
      user: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading && (!pointsOfSale || pointsOfSale.length === 0)) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Chargement des points de vente..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Points de vente"
        description="Gérez vos différents points de vente et leurs configurations"
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Nouveau point de vente
          </Button>
        }
      />

      {Array.isArray(pointsOfSale) && pointsOfSale.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pointsOfSale.map((pos) => (
            <Card key={pos._id} hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {pos.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    {pos.location}
                  </div>
                </div>
                <Badge variant={pos.isActive ? "success" : "danger"}>
                  {pos.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Server className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-gray-700">
                    {pos.mikrotikConfig?.host || "N/A"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Utilisateur:{" "}
                  <span className="font-semibold">
                    {pos.mikrotikConfig?.user || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/pos/${pos._id}/stats`)}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Statistiques
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(pos._id, pos.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun point de vente
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre premier point de vente
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Créer un point de vente
          </Button>
        </Card>
      )}

      {/* Modal Création */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Nouveau point de vente"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du point de vente"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Itad Ankorondrano"
            required
          />

          <Input
            label="Localisation"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ex: Ankorondrano, Antananarivo"
            required
          />

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Configuration Mikrotik</h3>

            <Input
              label="Adresse IP"
              name="host"
              value={formData.host}
              onChange={handleChange}
              placeholder="192.168.1.1"
              required
            />

            <Input
              label="Utilisateur"
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="admin"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Créer le point de vente
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

export default PointsOfSale;
