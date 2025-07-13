import React from 'react';
import { useNavigate } from 'react-router-dom';

function ButonInapoiMedic() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard-medic")}
      className="mt-10 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 block mx-auto"
    >
      ← Înapoi la Dashboard
    </button>
  );
}

export default ButonInapoiMedic;
