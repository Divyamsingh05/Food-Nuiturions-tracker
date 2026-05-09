import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FoodSearch from "./pages/FoodSearch";
import Journal from "./pages/Journal";
import History from "./pages/History";
import Settings from "./pages/Settings";
import VisionScanner from "./pages/VisionScanner";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/search"   element={<FoodSearch />} />
          <Route path="/journal"  element={<Journal />} />
          <Route path="/history"  element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scan"     element={<VisionScanner />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
