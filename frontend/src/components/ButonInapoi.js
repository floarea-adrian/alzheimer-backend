import React from 'react';
import { useNavigate } from 'react-router-dom';

function ButonInapoi() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/pacient/dashboard')}
      className="mb-4 px-4 py-2 bg-gray-600  text-white/80 rounded-xl hover:bg-gray-700 transition"
    >
      ← Înapoi la Dashboard
    </button>
  );
}

export default ButonInapoi;
