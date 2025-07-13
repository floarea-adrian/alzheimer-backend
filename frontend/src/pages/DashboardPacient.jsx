

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCog,
  History,
  FileText,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import GraficScoruri from "../pages/GraficEvolutiePacient"; 



function DashboardPacient() {
  const navigate = useNavigate();
  const utilizator = JSON.parse(localStorage.getItem("utilizator"));
  const numeComplet = utilizator
    ? `${utilizator.prenume} ${utilizator.nume}`
    : "Utilizator";

  const [profilDeschis, setProfilDeschis] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

const iconStyles = {
  test: "text-green-600",
  fisa: "text-blue-600",
  istoric: "text-yellow-600",
  logout: "text-red-600",
};
      

  return (
    
    <div className="relative  min-h-screen bg-black/50 text-gray-950 font-sans">
      
      <div className="fixed inset-0 -z-10">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
      {/* FUNDAL GRADIENT ANIMAT */}
      {/* <div className="fixed inset-0 z-1 animate-gradient bg-gradient-to-br from-darkbg via-darkmid to-darkbg bg-[length:200%_200%]"></div> */}

      {/* CONȚINUT */}
      <div className="relative z-1   flex flex-col min-h-screen">
        {/* BARĂ SUS */}
        <div className=" text-700 flex justify-between text-black-700 items-center px-6 py-2 backdrop-blur-lg bg-zinc-400/40 border-b border-white/10 shadow-md">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="Logo" className=" w-12 h-12 hover:w-40 hover:h-40" />
            <span className="text-2xl font-semibold tracking-wider">MindStage</span>
          </div>


          {/* PROFIL */}
          <div className="relative flex">
            {utilizator?.avatar ? (
                <img
                  src={`http://localhost:5000${utilizator.avatar}`}
                  alt="Avatar"
                  className="w-12 h-12 mr-2 rounded-full object-cover border border-white"
                />
              ) : (
                <div className="w-12 h-12 mr-2 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  {utilizator?.prenume?.charAt(0) || "U"}
                </div>
              )}
            <button
              onClick={() => setProfilDeschis(!profilDeschis)}
              className="flex items-center gap-2 bg-red-300/30 hover:bg-white/40 text-green-300 transition px-4 py-2 rounded-full text-sm font-medium shadow"
            >

              {numeComplet}
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {profilDeschis && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50 text-sm overflow-hidden"
                >
                  <button
                    onClick={() => navigate("/setari-cont")}
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    <Settings className="inline w-4 h-4 mr-2" />
                    Setări cont
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    <LogOut className={`inline w-4 h-4 mr-2 ${iconStyles.logout}`} />
                    Delogare
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CARDURI */}
        <main className="flex-1 flex flex-col items-center justify-start py-10 px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/pacient/test")}
              className="flex items-center justify-between bg-zinc-400/70 backdrop-blur-lg p-6 rounded-2xl hover:scale-[1.02] hover:bg-white/30 transition-all shadow-md"
            >
              <span className="text-lg font-semibold">Testul MMSE - 2</span>
              <BrainCog className={`w-8 h-8 ${iconStyles.test}`} />
            </button>

            <button
              onClick={() => navigate("/pacient/fisa")}
              className="flex items-center justify-between bg-zinc-400/70 backdrop-blur-lg p-6 rounded-2xl hover:scale-[1.02] hover:bg-white/30 transition-all shadow-md"
            >
              <span className="text-lg font-semibold">Fișa medicală</span>
              <FileText className={`w-8 h-8 ${iconStyles.fisa}`} />
            </button>

            <button
              onClick={() => navigate("/istoric")}
              className="flex items-center justify-between bg-zinc-400/80  p-6 rounded-2xl hover:scale-[1.02] hover:bg-white/50 transition-all shadow-md"
            >
              <span className="text-lg font-semibold">Istoric testări</span>
              <History className={`w-8 h-8 ${iconStyles.istoric}`} />
            </button>
          </motion.div>

          {/* GRAFIC */}
          <motion.div
              className="mt-10 w-full  max-w-5xl bg-zinc-400/70 backdrop-blur-lg rounded-3xl shadow-lg p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className=" w-full bg-black-400"></div>
              <GraficScoruri />
          </motion.div>

        </main>
      </div>
    </div>
  );
}

export default DashboardPacient;
