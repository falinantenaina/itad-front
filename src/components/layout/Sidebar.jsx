import {
  LayoutDashboard,
  LogOut,
  Receipt,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const superAdminLinks = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/pos", icon: Store, label: "Points de vente" },
    { path: "/cashiers", icon: Users, label: "Caissiers" },
    { path: "/plans", icon: Receipt, label: "Plans" },
    { path: "/sales", icon: TrendingUp, label: "Ventes" },
  ];

  const cashierLinks = [
    { path: "/sell", icon: Receipt, label: "Vendre un ticket" },
    { path: "/my-sales", icon: TrendingUp, label: "Mes ventes" },
    { path: "/plans", icon: Receipt, label: "Plans" },
  ];

  const links = user?.role === "super_admin" ? superAdminLinks : cashierLinks;

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          🌐 Itad
        </h2>
        <p className="text-sm text-gray-400 mt-1">{user?.username}</p>
        <p className="text-xs text-gray-500">
          {user?.role === "super_admin" ? "Super Admin" : "Caissier"}
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg"
                  : "hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
