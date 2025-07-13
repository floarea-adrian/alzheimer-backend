import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

const RaspunsuriTest = () => {
  const { id_test } = useParams();
  const [raspunsuri, setRaspunsuri] = useState([]);
  const [eroare, setEroare] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRaspunsuri = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:5000/api/teste/raspunsuri/${id_test}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setRaspunsuri(data);
        } else {
          setEroare(data.message || "Eroare la încărcarea răspunsurilor.");
        }
      } catch (err) {
        setEroare("Eroare la conectarea cu serverul.");
      }
    };

    fetchRaspunsuri();
  }, [id_test]);

  return (
  <>
    {/* Fundal video + overlay */}
    <div className="fixed inset-0 -z-10">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="fixed inset-0 bg-black/60 -z-10" />

    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 max-w-4xl w-full animate-fade-in">

        <h2 className="text-2xl font-bold text-center text-cyan-300 mb-6">
          🧠 Răspunsuri test #{id_test}
        </h2>

        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            ← Înapoi
          </button>
        </div>

        {eroare ? (
          <p className="text-red-400 text-center">{eroare}</p>
        ) : raspunsuri.length === 0 ? (
          <p className="text-center text-white/70">
            Nu există răspunsuri salvate pentru acest test.
          </p>
        ) : (
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {raspunsuri.map((r, i) => (
              <div key={i} className="bg-white/20 rounded-xl p-4 shadow-md hover:shadow-lg transition">
                <p className="mb-1">
                  <span className="font-semibold text-green-300">Întrebare:</span> {r.intrebare}
                </p>
                <p className="mb-1">
                  <span className="font-semibold text-amber-300">Răspuns:</span> {r.raspuns}
                </p>
                <p>
                  <span className="font-semibold text-blue-300">Punctaj:</span>{" "}
                  <span className="font-bold">{r.punctaj}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ScrollToTopButton />
    </div>
  </>
);

};

export default RaspunsuriTest;
