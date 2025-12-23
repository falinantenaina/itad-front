import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h1>
        <p className="text-gray-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link to="/login">
          <Button variant="primary">Retour à la connexion</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
