import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import { Unauthorized } from "./pages/Unauthorized";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "/dashboard",
      element: <div>Dashboard</div>,
    },
    {
      path: "/sell",
      element: <div>Sell</div>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
