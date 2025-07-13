import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmareParola, setConfirmareParola] = useState("");
  const [rol, setRol] = useState("pacient");
  const [eroare, setEroare] = useState("");
  const [succes, setSucces] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEroare("");
    setSucces("");

    if (!nume || !email || !parola || !rol) {
      setEroare("Toate câmpurile sunt obligatorii.");
      return;
    }

    if (parola.length < 6) {
      setEroare("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    if (parola !== confirmareParola) {
      setEroare("Parolele nu coincid.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nume, prenume, email, parola, rol }),
      });

      const data = await response.json();

      if (response.ok) {
        setSucces("Înregistrare reușită! Vei fi redirecționat...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setEroare(data.message || "Eroare la înregistrare.");
      }
    } catch (err) {
      setEroare("Eroare la conectarea cu serverul.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
        Înregistrare cont nou
      </h2>

      {eroare && <p className="text-red-600 text-center">{eroare}</p>}
      {succes && <p className="text-green-600 text-center">{succes}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          placeholder="Nume"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Prenume"
          value={prenume}
          onChange={(e) => setPrenume(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Parolă"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirmare parolă"
          value={confirmareParola}
          onChange={(e) => setConfirmareParola(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="pacient">Pacient</option>
          <option value="medic">Medic</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Creează cont
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Ai deja cont?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-indigo-600 hover:underline"
        >
          Autentifică-te aici
        </button>
      </p>
    </div>
  );
};

export default Register;
