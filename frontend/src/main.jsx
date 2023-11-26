import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrediksiPage from "./pages/prediksiPage.jsx";
import ChartsPage from "./pages/chartsPage.jsx";
import DaftarArtisPage from "./pages/daftarArtisPage.jsx";
import SideBar from "./components/sidebar/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/prediksi",
    element: <SideBar page={<PrediksiPage />} />,
  },
  {
    path: "/charts",
    element: <SideBar page={<ChartsPage />} />,
  },
  {
    path: "/daftar-artis",
    element: <SideBar page={<DaftarArtisPage />} />,
  },
  {
    path: "/sidebar",
    element: <SideBar page={<DaftarArtisPage />} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
