import { Route, Routes } from "react-router-dom";
import Navbar from "./components/headers/Navbar";
import Footer from "./components/footer/Footer";
import MarketPage from "./screens/marketPage";
import PricesPage from "./screens/pricesPage";
import SupportPage from "./screens/supportPage";
import OperatorPage from "./screens/operatorPage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MarketPage />} />
        <Route path="/prices" element={<PricesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/admin" element={<OperatorPage />} />
      </Routes>
      <Footer />
    </>
  );
}
