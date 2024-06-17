import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import HomePage from "../homePage/HomePage";
import ParameterListPage from "../parameterListPage/ParameterListPage";
import ReportPage from "../reportPage/ReportPage";
import DetailedInsightsPage from "../DetailedInsightsPage/DetailedInsightsPage";

const AppRouter: React.FC = () => {
  const [parameterFileName, setFileName] = useState<File | null>(null);

  const handleFileName = (name: File | null) => {
    setFileName(name);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/homepage"
          element={<HomePage onfileName={handleFileName} />}
        />
        <Route
          path="/upload"
          element={<ParameterListPage parameterFileName={parameterFileName} />}
        />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/detailed-insights" element={<DetailedInsightsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
