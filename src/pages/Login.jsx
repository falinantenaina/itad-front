import {Lock, LogIn, Mail } from "lucide-react";
import { LoaderIcon } from "react-hot-toast";
import logo from "../assets/logo.webp";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, isLoading } = useAuthStore();

  useEffect(() => {
     if (isAuthenticated) { 
        if(user?.role === 'super_admin') {
          navigate("/dashboard")
        } else {
          navigate("/sell")
        }
      }
  }, [user, isAuthenticated])


  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await login(formData);
  };

  return (
    <div className="flex h-screen min-h-screen flex-col items-center px-8 md:justify-center">
      <div className="w-full space-y-4 py-6 md:space-y-8">
        <div>
          <h1 className="flex items-center justify-center gap-x-1 lg:gap-x-4">
            <img src={logo} alt="Itad logo" className="size-10 md:size-15" />
            <span className="text-2xl font-semibold md:text-5xl">Itad</span>
          </h1>
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-card mx-auto w-full max-w-md space-y-4 rounded-xl px-4 py-6 max-md:max-w-sm md:px-8 md:py-8"
        >
          <h2 className="text-2xl md:text-3xl">Connexion</h2>
          <div className="space-y-4 md:space-y-8">
            <div className="space-y-2">
              <label
                htmlFor=""
                className="text-primary flex items-center gap-x-1"
              >
                <Mail className="size-4 md:size-6" strokeWidth={1} />
                <span className="md:text-xl">Email</span>
              </label>
              <input
                className="ring-primary/50 focus:outline-primary focus:shadow-primary w-full rounded-md px-2 py-2 ring-1 focus:shadow-sm focus:outline-1 md:px-6 md:py-4"
                type="email"
                required
                placeholder="admin@itad.com"
                name="email"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor=""
                className="text-primary flex items-center gap-x-1"
              >
                <Lock className="size-4 md:size-6" strokeWidth={1} />
                <span className="md:text-xl">Password</span>
              </label>
              <input
                className="ring-primary/50 focus:outline-primary focus:shadow-primary w-full rounded-md px-2 py-2 ring-1 focus:shadow-sm focus:outline-1 md:px-6 md:py-4"
                type="password"
                required
                placeholder="********"
                name="password"
              />
            </div>
          </div>
          <button className="btn w-full disabled:bg-card" disabled={isLoading}>
            <div className="flex w-full items-center justify-center gap-x-2">
              {isLoading ? (
                <>
                  <LoaderIcon />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <LogIn />
                  <span>Se connecter</span>
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
