import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";



function LoginPage() {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [eroare, setEroare] = useState(false);
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [parolaVizibila, setParolaVizibila] = useState(false);

  const handleLogin= async (e) => {
    e.preventDefault();

    if (!email || !parola) {
      setMesaj('Completează toate câmpurile!');
      setEroare(true);
      return;
    }

    try {
      const raspuns = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // dacă folosești cookie-uri
      body: JSON.stringify({ email, parola })
    });


      const data = await raspuns.json();



      if (!raspuns.ok) {
        throw new Error(data.message || 'Autentificare eșuată.');
      }

      // Salvăm tokenul JWT în localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem("utilizator", JSON.stringify(data.utilizator));

      // const storage = rememberMe ? localStorage : sessionStorage;
      // storage.setItem('token', data.token);
      // storage.setItem('utilizator', JSON.stringify(data.utilizator));

      
      setMesaj('Autentificare reușită!');
      setEroare(false);
      const decoded = jwtDecode(data.token);
      
      if (decoded.rol === 'medic') {
        navigate('/dashboard-medic');
      } else if (decoded.rol === 'pacient') {
        navigate('/pacient/dashboard');
        
        } else {
          setMesaj('Rol necunoscut.');
          setEroare(true);
        }


      // Redirecționează către altă pagină (ex: dashboard)
      // navigate('/dashboard'); // sau orice pagină ai în proiect

    } catch (err) {
      setMesaj(err.message);
      setEroare(true);
    }
  

  };


  return (
    <>
      {/* Fundal imagine */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/fundal-bunici.jpg')", // trebuie plasată în public/
        }}
      ></div>

      {/* Overlay semi-transparent */}
      <div className="fixed inset-0 bg-black/50 z-10"></div>

      {/* Card login */}
      <div className="relative z-20 flex items-center justify-center h-screen">
        {mesaj && (
          <div
            className={`mb-4 text-sm text-center px-4 py-2 rounded ${
              eroare ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {mesaj}
          </div>
        )}
        <form
          onSubmit={handleLogin} autoComplete="on"
          className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
        >
          <h1 className="text-3xl font-bold text-center mb-6 drop-shadow-md">
            Autentificare 
          </h1>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              className="w-full px-4 py-2 rounded bg-white/70 text-black focus:outline-none"
              type="email"
              name="email"
              value={email}
              autoComplete='username'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1">Parolă</label>
            <div className="relative group">
              <input
                type={parolaVizibila ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                required
                className="w-full pr-12 transition text-black duration-300 ease-in-out"
              />

              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition duration-200"
                onMouseDown={() => setParolaVizibila(true)}
                onMouseUp={() => setParolaVizibila(false)}
                onMouseLeave={() => setParolaVizibila(false)} // dacă scoți cursorul din zona butonului
              >
                {parolaVizibila ? (
                  <EyeOff className="w-5 h-5 transition-transform duration-200 scale-110" />
                ) : (
                  <Eye className="w-5 h-5 transition-transform duration-200 hover:scale-125" />
                )}
              </button>
            </div>
          </div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Ține-mă minte
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-colors py-2 rounded font-semibold shadow-md"
          >
            Autentifică-te
          </button>
          <p className="text-center text-md mt-4">
            Nu ai cont?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:underline"
            >
              Creează unul!
            </button>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
