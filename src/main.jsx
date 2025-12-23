import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Toaster
      toastOptions={{
        duration: 3000,
        style: {
          background: "#282828",
          color: "#fff",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#b8336a",
            secondary: "#fff",
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#b8336a",
            secondary: "#fff",
          },
        },
      }}
    />
  </BrowserRouter>
);
