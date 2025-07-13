import React from "react";

const ExportaPDFButton = ({ idPacient }) => {
  const handleExport = () => {
    const url = `http://localhost:5000/api/fisa/exporta-pdf/${idPacient}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleExport}
      className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md mb-2 transition duration-300 ease-in-out transform hover:scale-105"
    >
      Export fișă PDF
    </button>
  );
};

export default ExportaPDFButton;
