import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

const IstoricTeste = () => {
  // const { id } = useParams(); // ID pacient
  const [teste, setTeste] = useState([]);
  const [eroare] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const[numePacient, setNumePacient] = useState("");
  const utilizator = JSON.parse(localStorage.getItem('utilizator'));


  useEffect(() => {
  const token = localStorage.getItem('token');
  const id = params.id; // poate fi undefined

  const endpoint = id
    ? `http://localhost:5000/api/teste/istoric/${id}` // pentru medic
    : `http://localhost:5000/api/teste/istoric`;      // pentru pacient

  fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setTeste(data))
    .catch(err => console.error('Eroare la încărcare:', err));

  // 2. Dacă e medic, preluăm și numele pacientului
  if (id) {
    fetch(`http://localhost:5000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setNumePacient(`${data.prenume} ${data.nume}`);
      })
      .catch(err => {
        console.error("Eroare la preluarea numelui pacientului:", err);
      });
  }
}, [params.id]);


 
return (
  <>
    {/* Fundal video și overlay */}
    <div className="fixed inset-0 z-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="fixed inset-0 bg-black/60 z-[1]" />

    <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 py-12">
      <div className="bg-white/10 backdrop-blur-xl shadow-xl rounded-3xl p-8 max-w-6xl w-full text-white animate-fade-in">

        {/* Titlu și nume pacient */}
        <h2 className="text-3xl font-bold mb-4 text-center text-green-300">
          Istoric testări MMSE
        </h2>
       {utilizator?.rol === 'medic' && (
          <p className="text-center text-white/80 mb-6">
            {numePacient
              ? `Pacient: ${numePacient}`
              : params.id
              ? `Pacient ID: ${params.id}`
              : `Vizualizare proprie`}
          </p>
        )}

        {/* Buton Înapoi */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
          >
            ← Înapoi
          </button>
        </div>

        {/* Afișare eroare sau tabel */}
        {eroare ? (
          <p className="text-red-400 text-center">{eroare}</p>
        ) : teste.length === 0 ? (
          <p className="text-center text-white/70">
            Acest pacient nu are testări MMSE salvate.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow border border-white/10">
            <table className="w-full border-collapse text-sm text-white/90 shadow" >
              <thead className="bg-white/10">
                <tr className="text-gray-950">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Data testării</th>
                  <th className="px-4 py-3 text-left">Scor</th>
                  <th className="px-4 py-3 text-left">Interpretare AI</th>
                  <th className="px-4 py-3 text-left">Nivel risc</th>
                  <th className="px-4 py-3 text-left">Răspunsuri</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {teste.map((test, index) => {
                  const nivel = (test.nivel_risc || "").toLowerCase();
                  const culoare =
                    nivel === "normal"
                      ? "text-green-400 "
                      : nivel === "moderat"
                      ? "text-yellow-400"
                      : nivel === "sever"
                      ? "text-red-500"
                      : "text-white";

                  return (
                    <tr
                      key={index}
                      className="hover:bg-white/10 transition duration-150"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{test.data_test}</td>
                      <td className="px-4 py-3">{test.scor_total}/30</td>
                      <td className="px-4 py-3">
                      {test.interpretare ? (
                        <span className="text-gray-200">
                          {test.interpretare.normalize("NFC")}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Indisponibil
                        </span>
                      )}
                    </td>
                      <td className={`px-4 py-3 font-semibold ${culoare}`}>
                        {test.nivel_risc || "-"}
                      </td>
                      <td className="px-4 py-3">
                         <button
                        onClick={() => navigate(`/raspunsuri/${test.id_test}`)}
                        className="bg-blue-700/40 hover:bg-blue-600 text-white px-3 py-1 hover:text-green-300 transition rounded-md"
                      >
                        Vezi răspunsuri
                      </button>
                        {/* <button className="underline hover:text-green-300 transition">
                          Vezi răspunsuri
                        </button> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </div>
  </>
);
};
export default IstoricTeste;