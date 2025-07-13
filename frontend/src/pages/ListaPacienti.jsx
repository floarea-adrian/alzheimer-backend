import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButonInapoiMedic from '../components/ButonInapoiMedic';

const ListaPacienti = () => {
  const [pacienti, setPacienti] = useState([]);
  const [eroare, setEroare] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacienti = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/api/users/pacienti", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPacienti(data.pacienti); // sau data dacă backend-ul trimite direct array-ul
        } else {
          setEroare(data.message || "Eroare la încărcarea pacienților.");
        }
      } catch (err) {
        setEroare("Eroare la conectarea cu serverul.");
      }
    };

    fetchPacienti();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Lista pacienților
      </h2>

      {eroare && <p className="text-red-600 font-semibold mb-4 text-center">{eroare}</p>}

      {pacienti.length === 0 ? (
        <p className="text-center text-gray-600">Nu există pacienți.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pacienti.map((pacient) => (
            <div
              key={pacient.id_utilizator}
              className="border p-4 rounded-xl shadow hover:shadow-md transition"
              
            >
              
              <p className="text-lg font-semibold mb-1">
                {pacient.nume} {pacient.prenume}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Email: {pacient.email}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/medic/pacient/${pacient.id_utilizator}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  📄 Vezi fișa medicală
                </button>
                <button
                  onClick={() => navigate(`/istoric/${pacient.id_utilizator}`)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  📊 Vezi istoricul MMSE
                </button>
                <button
                  onClick={() => navigate(`/grafic/${pacient.id_utilizator}`)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  📈 Evoluție scoruri
                </button>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem("id_pacient_selectat", pacient.id_utilizator);
                  alert(`Chat activat cu ${pacient.nume} ${pacient.prenume}`);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2"
              >
                Chat
              </button>

            </div>
            
          ))}
        </div>
      )}

      <ButonInapoiMedic />
    </div>
  );
};

export default ListaPacienti;
