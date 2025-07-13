import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import ChatPopup from "../components/ChatPopup";


const DashboardMedic = () => {
  const utilizator = JSON.parse(localStorage.getItem("utilizator"));
  const navigate = useNavigate();
  const [pacienti, setPacienti] = useState([]);
  const [eroare, setEroare] = useState("");
  const [filtru, setFiltru] = useState("");
  const [fereastraDeschisa, setFereastraDeschisa] = useState(false);
  const [emailNou, setEmailNou] = useState("");
  const [mesaj, setMesaj] = useState("");


  useEffect(() => {
    const fetchPacienti = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/users/pacienti", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setPacienti(data.pacienti);
        } else {
          setEroare(data.message || "Eroare la încărcarea pacienților.");
        }
      } catch {
        setEroare("Eroare la conectarea cu serverul.");
      }
    };
    fetchPacienti();
  }, []);

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

const avatar = utilizator?.avatar;

const stergePacient = async (idPacient) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/api/users/sterge-pacient/${idPacient}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setPacienti(prev => prev.filter(p => p.id_utilizator !== idPacient));
      setMesaj("Pacient eliminat.");
    } else {
      setMesaj(data.message || "Eroare la eliminare.");
    }
  } catch {
    setMesaj("Eroare rețea la eliminare.");
  }
};

const adaugaPacient = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:5000/api/users/adauga-pacient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: emailNou }),
    });
    const data = await res.json();
    if (res.ok) {
       setMesaj(`Pacientul ${emailNou} a fost adăugat (simulat).`);
      setEmailNou("");
    } else {
      setMesaj(data.message || "Eroare la adăugare.");
    }
  } catch {
    setMesaj("Eroare rețea la adăugare.");
  }
  // reîncarcă lista de pacienți după adăugare
const resPacienti = await fetch("http://localhost:5000/api/users/pacienti", {
  headers: { Authorization: `Bearer ${token}` }
});
const dataPacienti = await resPacienti.json();
setPacienti(dataPacienti.pacienti);

};
      



  return (
  <>
    {/* Fundal video și overlay */}
    <div className="fixed inset-0 -z-10">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="fixed inset-0 bg-black/50 -z-10" />

    <div className=" text-700 flex justify-between text-black-700 items-center px-6 py-2 backdrop-blur-lg bg-zinc-400/40 border-b border-white/10 shadow-md">
              <div className="flex items-center gap-2">
                <img src="/favicon.ico" alt="Logo" className="w-12 h-12 hover:w-40 hover:h-40" />
                <span className="text-2xl font-semibold tracking-wider">MindStage</span>
              </div>
    
    
              {/* PROFIL */}
              <div className="relative flex ">
                <img
                  src={avatar ? `http://localhost:5000${avatar}` : "/default-avatar.png"}
                  alt="Avatar"
                  className="w-10 h-10 mr-2 rounded-full object-cover border border-white shadow-md"
                />

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
                        onClick={() => navigate("/setari-cont-medic")}
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

          <div className="min-h-screen px-4 py-16 text-white">
            <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl shadow-2xl rounded-[2rem] px-10 py-12 animate-fade-in">

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-300 mb-10 tracking-wider">
          Bine ai revenit, Dr. {utilizator?.prenume} {utilizator?.nume}
        </h1>
        <input
          type="text"
          value={filtru}
          onChange={(e) => setFiltru(e.target.value)}
          placeholder="🔍 Caută pacient după nume sau email..."
          className="w-full max-w-md mx-auto block mb-10 px-4 py-2 text-sm text-white bg-white/10 placeholder-white/60 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        


        {/* Titlu listă pacienți */}
        <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">📋 Lista pacienților</h2>

          <button
          onClick={() => setFereastraDeschisa(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white mb-6 px-4 py-2 rounded-lg shadow transition"
        >
          Gestionează pacienți
        </button>
        </div>
        {eroare && <p className="text-red-400 text-center mb-4">{eroare}</p>}

        {pacienti.length === 0 ? (
          <p className="text-center text-white/70">Nu există pacienți înregistrați.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pacienti
            .filter((p) =>
    `${p.nume} ${p.prenume} ${p.email}`.toLowerCase().includes(filtru.toLowerCase())
  )
            
            .map((pacient) => (
              <div
                key={pacient.id_utilizator}
                className="bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
              >
                {/* Header pacient */}
                <div className="flex items-center gap-4 mb-4">
                  {pacient.avatar ? (
                    <img
                      src={`http://localhost:5000${pacient.avatar}`}
                      alt="Avatar pacient"
                      className="w-12 h-12 rounded-full object-cover border border-white shadow"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow">
                      {pacient.prenume?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="text-lg font-semibold">{pacient.nume} {pacient.prenume}</p>
                    <p className="text-sm text-white/70">{pacient.email}</p>
                  </div>
                </div>

                {/* Butoane acțiune */}
                <div className="flex flex-wrap gap-3 mt-2">
                  <button onClick={() => navigate(`/medic/pacient/${pacient.id_utilizator}`)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-emerald-500 to-green-700 rounded-full text-sm hover:scale-105 transition">
                    📄 Fișă
                  </button>
                  <button onClick={() => navigate(`/istoric/${pacient.id_utilizator}`)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-sky-500 to-blue-700 rounded-full text-sm hover:scale-105 transition">
                    📊 Istoric
                  </button>
                  <button onClick={() => navigate(`/grafic/${pacient.id_utilizator}`)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-purple-500 to-fuchsia-700 rounded-full text-sm hover:scale-105 transition">
                    📈 Grafic
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ChatPopup />
    </div>
    {fereastraDeschisa && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div className="bg-white/90 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative text-black">
      <button
        onClick={() => { setFereastraDeschisa(false); setMesaj(""); }}
        className="absolute top-3 right-4 text-gray-600 text-xl"
      >
        ✖
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">👥 Gestionează pacienți</h2>

      <h3 className="font-semibold mb-2 text-sm">Pacienți actuali:</h3>
      <ul className="max-h-40 overflow-y-auto space-y-2 mb-4">
        {pacienti.map(p => (
          <li key={p.id_utilizator} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
            <span>{p.nume} {p.prenume}</span>
            <button
              onClick={() => stergePacient(p.id_utilizator)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Elimină
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={adaugaPacient}>
        <label className="block text-sm mb-1">Adaugă pacient prin email:</label>
        <input
          type="email"
          value={emailNou}
          onChange={(e) => setEmailNou(e.target.value)}
          placeholder="exemplu@pacient.ro"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 mb-3"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg w-full"
        >
          Adaugă pacient
        </button>
      </form>

      {mesaj && <p className="mt-3 text-sm text-center text-emerald-600">{mesaj}</p>}
    </div>
  </div>
)}
  </>
);

};

export default DashboardMedic;
