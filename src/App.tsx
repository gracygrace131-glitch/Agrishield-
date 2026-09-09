import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "./components/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CropAdvisorPage } from "./pages/CropAdvisorPage";
import { SmartIrrigationPage } from "./pages/SmartIrrigationPage";
import { ClimateRiskPage } from "./pages/ClimateRiskPage";
import { ProfitPredictorPage } from "./pages/ProfitPredictorPage";
import { CreditScorePage } from "./pages/CreditScorePage";
import { MachineryPage } from "./pages/MachineryPage";
import { SeedsShopPage } from "./pages/SeedsShopPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard & Farming Application Modules */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/crop-advisor" element={<CropAdvisorPage />} />
          <Route path="/irrigation" element={<SmartIrrigationPage />} />
          <Route path="/climate-risk" element={<ClimateRiskPage />} />
          <Route path="/profit-predictor" element={<ProfitPredictorPage />} />
          <Route path="/credit-score" element={<CreditScorePage />} />
          <Route path="/machinery" element={<MachineryPage />} />
          <Route path="/seeds-shop" element={<SeedsShopPage />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
