import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import ButonInapoiMedic from "../components/ButonInapoiMedic";

const GraficScoruri = () => {
  const { id } = useParams();
  const [scoruri, setScoruri] = useState([]);
  const [eroare, setEroare] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScoruri = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://localhost:5000/api/teste/istoric/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setScoruri(data);
        } else {
          setEroare(data.message || "Eroare la încărcarea datelor.");
        }
      } catch (err) {
        setEroare("Eroare la conectarea cu serverul.");
      }
    };

    fetchScoruri();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">
        Evoluția scorurilor MMSE
      </h2>
      <button
        onClick={() => navigate(-1)}
        className="mt-5 mb-3 ml-[7%] bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 block"
      >
        ← Înapoi
      </button>

      {eroare ? (
        <p className="text-red-600 text-center">{eroare}</p>
      ) : scoruri.length === 0 ? (
        <p className="text-center text-gray-600">
          Nu există testări pentru acest pacient.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={scoruri}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data_test" />
            <YAxis domain={[0, 30]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="scor_total"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GraficScoruri;
