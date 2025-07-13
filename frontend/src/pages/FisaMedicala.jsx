

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExportaPDFButton from "../components/ExportaPDFButton";
import ScrollToTopButton from "../components/ScrollToTopButton";

const FisaMedicala = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [utilizator, setUtilizator] = useState(null);
  const [idPacient, setIdPacient] = useState(null);
  const [fisa, setFisa] = useState(null);
  const [diagnostic, setDiagnostic] = useState("");
  const [tratament, setTratament] = useState("");
  const [observatii, setObservatii] = useState("");
  const [boliCronice, setBoliCronice] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [eroare, setEroare] = useState("");

  const esteMedic = utilizator?.rol === "medic";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("utilizator"));
    if (user) {
      setUtilizator(user);
      const id = user.rol === "pacient" ? user.id : params.id_pacient;
      setIdPacient(id);
      console.log("Utilizator:", user);
    // console.log("ID pacient calculat:", id);
    } else {
      setEroare("Utilizatorul nu este autentificat.");
    }
  }, [params]);

  useEffect(() => {
    if (!idPacient) return;

    const fetchFisa = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:5000/api/fisa/${idPacient}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data && data.id_fisa) {
          setFisa(data);
          console.log("Fișa încărcată:", data);
          setDiagnostic(data.diagnostic || "");
          setTratament(data.tratament || "");
          setObservatii(data.observatii || "");
          setBoliCronice(data.date_pacient?.boli_cronice || "");

        } else {
          const creare = await fetch(`http://localhost:5000/api/fisa/${idPacient}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });

          const newFisa = await creare.json();
          setFisa(newFisa.fisa);
        }
      } catch (error) {
        console.error("❌ Eroare la obținerea fișei medicale:", error);
        setEroare("Eroare la conectarea cu serverul.");
      }
    };

    fetchFisa();
  }, [idPacient]);

  const handleChange = (e) => {
    setFisa({ ...fisa, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!fisa.nume_medic) {
      fisa.nume_medic = `${utilizator.prenume} ${utilizator.nume}`;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/fisa/${idPacient}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diagnostic,
          tratament,
          observatii,
          boli_cronice: utilizator.rol === "pacient" ? boliCronice : fisa.boli_cronice,
          investigatii_paraclinice: fisa.investigatii_paraclinice,
          data_consultatie: fisa.data_consultatie,
          nume_medic: fisa.nume_medic,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMesaj("✔ Fișa a fost salvată cu succes.");
        setFisa(data.fisa);
      } else {
        setMesaj(data.message || "Eroare la salvare.");
      }
    } catch (err) {
      setMesaj("Eroare la conectarea cu serverul.");
    }
  };

// {utilizator && <ExportaPDFButton idPacient={utilizator.id} />}

  return (
    <>  
    <div className="fixed inset-0 z-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="fixed inset-0 bg-black/50 z-[1]" />

    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
    <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-3xl p-8 max-w-4xl w-full text-white animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <button onClick={() => navigate(-1)} className="mb-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 block ">
              ← Înapoi
            </button>
          </div>
          <div> { idPacient && <ExportaPDFButton idPacient={idPacient} /> }</div>
        </div>
        <div className="mx-auto">
          <h2 className="text-xl font-semibold text-center text-slate-950 mb-6">
            Fișă medicală – {fisa?.date_pacient?.prenume} {fisa?.date_pacient?.nume}
          </h2>
        </div>
      
      
        {eroare && (
          <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded mb-4">{eroare}</div>
        )}
        {mesaj && (
          <div className="bg-green-600/20 text-green-300 px-4 py-2 rounded mb-4">{mesaj}</div>
        )}  

        {fisa?.date_pacient && (
          <div className=" border border-gray-400 bg-white/40 p-6 rounded-xl mb-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-950 ">
              📋 Date de identificare pacient
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  text-black/70 mb-1">
              <div><span className="font-semibold">Nume:</span> {fisa.date_pacient.nume} {fisa.date_pacient.prenume}</div>
              <div><span className="font-semibold">CNP:</span> {fisa.date_pacient.cnp}</div>
              <div><span className="font-semibold">Sex:</span> {fisa.date_pacient.sex === "M" ? "Masculin" : "Feminin"}</div>
              <div><span className="font-semibold">Vârstă:</span> {fisa.date_pacient.varsta}</div>
              <div><span className="font-semibold">Adresă:</span> {fisa.date_pacient.adresa}</div>
              <div><span className="font-semibold">Aparținător:</span> {fisa.date_pacient.apartinator}</div>
              {/* <div className="md:col-span-2">
                <span className="font-semibold">Boli cronice:</span>{" "}
                {fisa.date_pacient.boli_cronice || "Nu sunt specificate."}
              </div> */}

            </div>
          </div>
        )}

      {fisa && (
        esteMedic ? (
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div>
              <label className="block font-semibold text-gray-950 ">Diagnostic:</label>
              <textarea type="text" value={diagnostic} onChange={(e) => setDiagnostic(e.target.value)} className="w-full text-gray-800 bg-white/40 border border-green-600 p-2 rounded" />
              {fisa.interpretare_ai && (
                <div className="mt-2 text-md text-black/70">
                  💡 <strong>Interpretare AI:</strong> {fisa.interpretare_ai}
                  <br />
                  <button type="button" onClick={() => setDiagnostic(fisa.interpretare_ai)} className="text-blue-800 underline">📋 Folosește sugestia AI</button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-950 ">Tratament:</label>
              <textarea type="text" value={tratament} onChange={(e) => setTratament(e.target.value)} className="w-full bg-white/40 text-gray-800 border border-green-600 p-2 rounded" />
            </div>

            <div>
              <label className="block font-semibold text-gray-950">Observații:</label>
              <textarea value={observatii} onChange={(e) => setObservatii(e.target.value)} className="w-full bg-white/40 text-gray-800 border border-green-600 p-2 rounded" />
            </div>

            <div>
              <label className="block font-semibold text-gray-950">Investigații paraclinice:</label>
              <textarea name="investigatii_paraclinice" value={fisa.investigatii_paraclinice || ""} onChange={handleChange} className="w-full bg-white/40 text-gray-800 border border-green-600 p-2 rounded" rows={3} />
            </div>

            <div>
              <label className="block font-semibold text-gray-950">Data consultației:</label>
              <input type="date" name="data_consultatie" value={fisa.data_consultatie?.substring(0, 10) || ""} onChange={handleChange} className="w-full bg-white/40 text-gray-800 border border-green-600 p-2 rounded" />
            </div>

            <div>
              <label className="block font-semibold text-gray-950">Numele medicului:</label>
              <input type="text" name="nume_medic" value={fisa.nume_medic || `${utilizator?.prenume} ${utilizator?.nume}`} onChange={handleChange} className="w-full bg-white/40 text-gray-800 border border-green-600 p-2 rounded" />
            </div>

            <div>
              <label className="block font-semibold text-gray-950">Boli cronice:</label>
              {utilizator?.rol === "pacient" ? (
                <textarea name="boli_cronice" value={boliCronice} onChange={(e) => setBoliCronice(e.target.value)} className="w-full bg-white/40 border p-2 rounded" rows={3} />
              ) : (
                <div className="bg-gray-100 bg-white/40 text-gray-800 p-2 rounded">{fisa.date_pacient?.boli_cronice || "Nu sunt specificate."}</div>
              )}
            </div>

            <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">💾 Salvează fișa</button>
          </form>
        ) : (
          <div className="space-y-2 text-gray-800 border bg-white/40 border-gray-400 p-4 rounded shadow-2xl">
            <p><strong>Diagnostic:</strong> {diagnostic || "–"}</p>
            <p><strong>Tratament:</strong> {tratament || "–"}</p>
            <p><strong>Observații:</strong> {observatii || "–"}</p>
            <p><strong>Boli cronice:</strong> {boliCronice || "–"}</p>
            <p><strong>Investigații paraclinice:</strong> {fisa?.investigatii_paraclinice || "–"}</p>
            <p><strong>Data consultației:</strong> {fisa?.data_consultatie?.substring(0, 10) || "–"}</p>
            {/* <p><strong>Medic curant:</strong> {fisa?.nume_medic || "–"}</p> */}
            <p><strong>Actualizată la:</strong> {fisa?.data_actualizarii?.split("T")[0] || "–"}</p>
          </div>
        )
      )}
    </div>
      <><ScrollToTopButton /></>   
    </div>
    </>
  );
};

export default FisaMedicala;