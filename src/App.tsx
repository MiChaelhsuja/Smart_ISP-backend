import { Routes, Route } from "react-router-dom";
import MainLayout from "../src/components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Routers from "./pages/Routers";
import Collectors from "./pages/Collectors";
import PaymentsLogs from "./pages/PaymentsLogs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import HelpSupportPage from "./pages/HelpSupportPage";
import FAQPage from "./pages/FAQPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="routers" element={<Routers />} />
        <Route path="collectors" element={<Collectors />} />
        <Route path="payments-logs" element={<PaymentsLogs />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help-support" element={<HelpSupportPage />} />
        <Route path="faq" element={<FAQPage />} />
      </Route>
    </Routes>
  );
}

export default App;
