import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

const SetariCont = () => {
  const [profil, setProfil] = useState({
    nume: "",
    prenume: "",
    cnp: "",
    varsta: "",
    sex: "",
    adresa: "",
    apartinator: "",
    boli_cronice: "",
    studii: "",
  });

  const [mesaj, setMesaj] = useState("");
  const [eroare, setEroare] = useState("");
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [parola, setParola] = useState({ actuala: "", noua: "", confirmare: "" });
  const [nivelStudii, setNivelStudii] = useState("");


  useEffect(() => {
    const fetchProfil = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/api/users/profil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfil(data);
          setNivelStudii(String(data.studii ?? ""));
        } else {
          setEroare(data.message || "Eroare la încărcarea datelor.");
        }

      } catch (err) {
        setEroare("Eroare la conectarea cu serverul.");
      }
    };

    fetchProfil();
  }, []);

  const handleChange = (e) => {
    setProfil({ ...profil, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMesaj("");
  setEroare("");

  const token = localStorage.getItem("token");

  const bodyProfil = {
    nume: profil.nume,
    prenume: profil.prenume,
    cnp: profil.cnp,
    sex: profil.sex,
    varsta: profil.varsta,
    adresa: profil.adresa,
    apartinator: profil.apartinator,
    boli_cronice: profil.boli_cronice,
    studii: profil.studii
  };

  try {
    const response = await fetch("http://localhost:5000/api/users/profil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bodyProfil)
    });

    const data = await response.json();
    if (response.ok) {
      setMesaj("✔ Datele au fost salvate cu succes.");
      setProfil(data); 
      setNivelStudii(String(data.studii ?? ""));
    } else {
      setEroare(data.message || "Eroare la salvare.");
    }
    console.log("Date primite la salvare:", data);

  } catch (err) {
    setEroare("Eroare la conectarea cu serverul.");
  }
};

const handleSalvareAvatar = async () => {
  if (!profil.avatarFisier) {
    setEroare("Selectează o imagine mai întâi.");
    return;
  }

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("avatar", profil.avatarFisier);

  try {
    const res = await fetch("http://localhost:5000/api/users/avatar", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setMesaj("Avatar salvat cu succes.");
      const local = JSON.parse(localStorage.getItem("utilizator"));
      local.avatar = data.avatar;
      localStorage.setItem("utilizator", JSON.stringify(local));
    } else {
      setEroare(data.message || "Eroare la salvarea avatarului.");
    }
  } catch {
    setEroare("Eroare rețea la salvarea avatarului.");
  }
};

 const handleParolaChange = (e) => {
    setParola({ ...parola, [e.target.name]: e.target.value });
  };


const handleSchimbaParola = async (e) => {
    e.preventDefault();
    setMesaj(""); setEroare("");

    if (parola.noua !== parola.confirmare) {
      return setEroare("Parolele nu coincid.");
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/users/parola", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          actuala: parola.actuala,
          noua: parola.noua
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMesaj("Parola a fost schimbată cu succes.");
        setParola({ actuala: "", noua: "", confirmare: "" });
      } else {
        setEroare(data.message || "Eroare la schimbarea parolei.");
      }
    } catch {
      setEroare("Eroare server.");
    }
  };



 return (
  <>
    {/* Fundal video */}
    <div className="fixed inset-0 -z-10">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="fixed inset-0 bg-black/60 -z-10" />

    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 max-w-xl w-full animate-fade-in">
        
        <h2 className="text-3xl font-bold text-center text-emerald-300 mb-6">
          ⚙️ Setări cont pacient
        </h2>
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
          >
            ← Înapoi
          </button>
        </div>

        {eroare && <p className="text-red-400 text-center mb-4">{eroare}</p>}
        {mesaj && <p className="text-green-400 text-center mb-4">{mesaj}</p>}
        {/* <pre className="text-xs bg-black text-green-400 p-2 rounded">
          {JSON.stringify(profil, null, 2)}
        </pre> */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            ["Nume", "nume"],
            ["Prenume", "prenume"],
            ["CNP", "cnp"],
            ["Vârstă", "varsta"],
            ["Adresă", "adresa"],
            ["Aparținător", "apartinator"],
            // ["Email", "email"],
            // ["Telefon", "telefon"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="block mb-1 font-medium text-green-200">{label}:</label>
              <input
                type="text"
                name={name}
                value={profil[name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/60 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          ))}
          <div>
            <label className="block mb-1 font-medium text-green-200">Nivelul:</label>
            <select
              name="nivel_studii"
              value={nivelStudii}
              onChange={(e) => setNivelStudii(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Alege nivelul</option>
              <option value="0">Studii intermediare</option>
              <option value="1">Studii medii</option>
              <option value="2">Studii superioare</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-green-200">🩺 Boli cronice:</label>
            <textarea
              name="boli_cronice"
              value={profil.boli_cronice }
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-green-200">Sex:</label>
            <select
              name="sex"
              value={profil.sex || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-black/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Selectează...</option>
              <option value="M">Masculin</option>
              <option value="F">Feminin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition"
          >
            Salvează modificările
          </button>

        </form>
        {/* avatar */}
          <div>
            <label className="block mb-1 mt-10 font-medium text-emerald-200">Imagine avatar:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setProfil({ ...profil, avatarFisier: file });
                }
              }}
              className="w-full bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview avatar"
                className="mt-3 h-24 w-24 rounded-full object-cover border border-white/20 shadow-md"
              />
            )}
          </div>

          <button
            onClick={handleSalvareAvatar}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition"
          >
            Salvează avatar
          </button>

          

{/* Secțiune schimbare parolă */}
          <div className="mt-10 border-t border-white/20 pt-6">
            <h3 className="text-lg font-bold mb-4 text-indigo-200">🔐 Schimbă parola</h3>
            <form onSubmit={handleSchimbaParola} className="space-y-4">
              <input
                type="password"
                name="actuala"
                value={parola.actuala}
                onChange={handleParolaChange}
                placeholder="Parola actuală"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              />
              <input
                type="password"
                name="noua"
                value={parola.noua}
                onChange={handleParolaChange}
                placeholder="Parolă nouă"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              />
              <input
                type="password"
                name="confirmare"
                value={parola.confirmare}
                onChange={handleParolaChange}
                placeholder="Confirmă parola nouă"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              />
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold transition"
              >
                Schimbă parola
              </button>
            </form>
            </div>

         {eroare && <p className="text-red-400 text-center mb-4">{eroare}</p>}
        {mesaj && <p className="text-green-400 text-center mb-4">{mesaj}</p>}
      </div>

      <ScrollToTopButton />
    </div>
  </>
);
};

export default SetariCont;
