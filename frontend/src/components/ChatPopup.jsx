// import React, { useEffect, useState } from "react";


// const ChatPopup = ({ idDestinatar }) => {
//   const [deschis, setDeschis] = useState(false);
//   const [mesaje, setMesaje] = useState([]);
//   const [text, setText] = useState("");

//   const toggleChat = () => setDeschis(!deschis);

//   useEffect(() => {
//   if (deschis) {
//     const incarcaMesaje = async () => {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`http://localhost:5000/api/chat/${idDestinatar}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setMesaje(data);
//     };
//     incarcaMesaje();
//   }
// }, [deschis, idDestinatar]);

//   const trimiteMesaj = async () => {
//   const token = localStorage.getItem("token");
//   if (!text.trim()) return;

//   await fetch(`http://localhost:5000/api/chat`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ catre: idDestinatar, text }),
//   });

//   setText("");
//   incarcaMesaje(); // după trimitere, reîncarcă mesajele
// };

//   return (
//     <>
//       <button
//         onClick={toggleChat}
//         className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white text-xl p-4 rounded-full shadow-lg z-50"
//         aria-label="Deschide chat"
//       >
//         💬
//       </button>

//       {deschis && (
//         <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 shadow-xl rounded-lg z-50 flex flex-col">
//           <div className="bg-green-600 text-white p-2 font-semibold rounded-t-lg">
//             Chat cu medicul/pacientul
//           </div>
//           <div className="flex-1 overflow-y-auto p-2 text-sm">
//             {mesaje.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`mb-1 p-2 rounded-lg ${
//                   msg.de_la === parseInt(localStorage.getItem("id"))
//                     ? "bg-green-100 text-right"
//                     : "bg-gray-200 text-left"
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <div className="p-2 border-t flex gap-2">
//             <input
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               className="flex-1 border px-2 py-1 rounded text-sm"
//               placeholder="Scrie un mesaj..."
//             />
//             <button
//               onClick={trimiteMesaj}
//               className="bg-green-600 text-white px-3 py-1 rounded"
//             >
//               Trimite
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatPopup;







import React, { useState, useEffect } from "react";

const ChatPopup = () => {
  const [deschis, setDeschis] = useState(false);
  const [mesaje, setMesaje] = useState([]);
  const [text, setText] = useState("");

  const idDestinatar = 1; // 🔁 înlocuiește cu ID pacient real, dacă ai logică de selectare

  const incarcaMesaje = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/chat/${idDestinatar}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMesaje(data);
  };

  const trimiteMesaj = async () => {
    const token = localStorage.getItem("token");
    if (!text.trim()) return;

    await fetch(`http://localhost:5000/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ catre: idDestinatar, text }),
    });

    setText("");
    incarcaMesaje();
  };

  useEffect(() => {
    if (deschis) incarcaMesaje();
  }, [deschis]);

  return (
    <>
      {/* Buton plutitor */}
      <button
        onClick={() => setDeschis(!deschis)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white text-xl p-4 rounded-full shadow-lg z-50"
        aria-label="Deschide chat"
      >
        💬
      </button>

      {/* Fereastră chat */}
      {deschis && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white/90 text-black border border-gray-300 shadow-2xl rounded-xl z-50 flex flex-col overflow-hidden">
          <div className="bg-emerald-600 text-white p-3 font-bold text-center">
            Chat direct
          </div>

          <div className="flex-1 overflow-y-auto p-3 text-sm space-y-2">
            {mesaje.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.de_la === parseInt(localStorage.getItem("id"))
                    ? "bg-emerald-100 self-end ml-auto text-right"
                    : "bg-gray-200 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border px-2 py-1 rounded text-sm"
              placeholder="Scrie un mesaj..."
            />
            <button
              onClick={trimiteMesaj}
              className="bg-emerald-600 text-white px-3 py-1 rounded"
            >
              Trimite
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
