import { Check, Copy, CreditCard, DollarSign, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { usePlanStore } from "../../store/planStore";
import { useTicketStore } from "../../store/ticketStore";

const SellTicket = () => {
  const { plans, fetchPlans, isLoading: plansLoading } = usePlanStore();
  const {
    purchaseTicket,
    currentTicket,
    clearTicket,
    isLoading: ticketLoading,
  } = useTicketStore();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerData, setCustomerData] = useState({
    phoneNumber: "",
    customerEmail: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPlan || !paymentMethod) {
      toast.error("Veuillez sélectionner un plan et une méthode de paiement");
      return;
    }

    try {
      await purchaseTicket({
        planId: selectedPlan._id,
        paymentMethod,
        phoneNumber: customerData.phoneNumber,
        customerEmail: customerData.customerEmail,
      });
      toast.success("Ticket créé avec succès !");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    }
  };

  const handleNewSale = () => {
    clearTicket();
    setSelectedPlan(null);
    setPaymentMethod("");
    setCustomerData({ phoneNumber: "", customerEmail: "" });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copié !");
  };

  if (plansLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  // Affichage du ticket vendu
  if (currentTicket) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ticket vendu avec succès !
            </h2>
            <p className="text-gray-600 mb-6">
              Voici le code de connexion du client
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 mb-6">
              <div className="text-sm text-gray-600 mb-2">
                Code de connexion
              </div>
              <div className="text-4xl font-bold font-mono text-primary-600 mb-4 tracking-wider">
                {currentTicket.code}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(currentTicket.code)}
              >
                <Copy className="w-4 h-4" />
                Copier le code
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3">Détails du ticket</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">
                    {currentTicket.planName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-semibold">
                    {currentTicket.duration}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix:</span>
                  <span className="font-semibold text-green-600">
                    {currentTicket.price?.toLocaleString()} Ar
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">
                Instructions pour le client
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Connectez-vous au WiFi du hotspot</li>
                <li>
                  Sur la page de connexion Mikrotik, entrez le code dans
                  Username
                </li>
                <li>
                  Entrez le <strong>même code</strong> dans Password
                </li>
                <li>Cliquez sur "Se connecter"</li>
              </ol>
            </div>

            <Button onClick={handleNewSale} className="w-full">
              Vendre un autre ticket
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendre un ticket"
        description="Sélectionnez un plan et créez un nouveau ticket"
      />

      {/* Sélection du plan */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choisir un plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className={`cursor-pointer transition-all ${
                selectedPlan?._id === plan._id
                  ? "ring-4 ring-primary-500 shadow-xl"
                  : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {plan.duration}h
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.name}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {plan.price.toLocaleString()} Ar
                </div>
                {plan.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Méthode de paiement */}
      {selectedPlan && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Méthode de paiement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "orange_money"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("orange_money")}
            >
              <Smartphone className="w-8 h-8 text-orange-500 mb-2" />
              <div className="font-semibold">Orange Money</div>
            </div>

            <div
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "mvola"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("mvola")}
            >
              <CreditCard className="w-8 h-8 text-red-500 mb-2" />
              <div className="font-semibold">MVola</div>
            </div>

            <div
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === "cash"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              <DollarSign className="w-8 h-8 text-green-500 mb-2" />
              <div className="font-semibold">Espèces</div>
            </div>
          </div>
        </Card>
      )}

      {/* Informations client (optionnel) */}
      {selectedPlan && paymentMethod && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Informations client (optionnel)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Numéro de téléphone"
              type="tel"
              value={customerData.phoneNumber}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  phoneNumber: e.target.value,
                })
              }
              placeholder="034 00 000 00"
            />
            <Input
              label="Email"
              type="email"
              value={customerData.customerEmail}
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  customerEmail: e.target.value,
                })
              }
              placeholder="client@example.com"
            />
          </div>
        </Card>
      )}

      {/* Bouton de validation */}
      {selectedPlan && paymentMethod && (
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total à payer</div>
              <div className="text-3xl font-bold text-primary-600">
                {selectedPlan.price.toLocaleString()} Ar
              </div>
            </div>
            <Button
              onClick={handlePurchase}
              isLoading={ticketLoading}
              size="lg"
            >
              Valider la vente
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default SellTicket;
