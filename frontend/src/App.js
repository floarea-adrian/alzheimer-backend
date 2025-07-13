import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TestMMSEWizard from "./pages/TestMMSEWizard";
import IstoricTeste from "./pages/IstoricTeste";
import DashboardPacient from "./pages/DashboardPacient";
import FisaMedicala from "./pages/FisaMedicala";
import DashboardMedic from "./pages/DashboardMedic";
import ListaPacienti from "./pages/ListaPacienti";
import GraficScoruri from "./pages/GraficScoruri";
import RaspunsuriTest from "./pages/RaspunsuriTest";
import Register from "./pages/Register";
import SetariCont from "./pages/SetariCont";
import GraficEvolutiePacient from "./pages/GraficEvolutiePacient";
import ChatPopup from "./components/ChatPopup";
import SetariContMedic from "./pages/SetariContMedic";





function App() {

  const rol = localStorage.getItem("rol");
  const idDestinatar =
    rol === "pacient"
      ? localStorage.getItem("id_medic")
      : localStorage.getItem("id_pacient_selectat");
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard-medic" element={<DashboardMedic />} />
          <Route path="/medic/pacienti" element={<ListaPacienti />} />
          <Route path="/pacient/test" element={<TestMMSEWizard />} />
          <Route path="/pacient/dashboard" element={<DashboardPacient />} />
          <Route path="/pacient/fisa" element={<FisaMedicala />} />   
          <Route path="/medic/pacient/:id_pacient" element={<FisaMedicala />} />
          <Route path="/grafic/:id" element={<GraficScoruri />} />
          <Route path="/istoric" element={<IstoricTeste />} /> 
          <Route path="/istoric/:id" element={<IstoricTeste />} /> 
          <Route path="/raspunsuri/:id_test" element={<RaspunsuriTest />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setari-cont" element={<SetariCont />} />
          <Route path="/grafic" element={<GraficEvolutiePacient />} />
          <Route path="/setari-cont-medic" element={<SetariContMedic />} />
        </Routes>
        {idDestinatar && <ChatPopup idDestinatar={parseInt(idDestinatar)} />}
      </Router>
    </>
  );
}

export default App;
