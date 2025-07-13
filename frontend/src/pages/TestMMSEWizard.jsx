import React, { useState } from 'react';
import ButonInapoi from '../components/ButonInapoi';
import { useEffect } from 'react';



const intrebari = [
  {
    text: 'Care este anul curent?',
    puncte: 2,
    optiuni: ['2022', '2023', '2024', '2025'],
    raspuns_corect: '2025',
  },
  {
    text: 'În ce anotimp suntem?',
    puncte: 2,
    optiuni: ['Primăvară', 'Vară', 'Toamnă', 'Iarnă'],
    raspuns_corect: 'Vară',
  },
  {
    text: 'Ce zi a săptămânii este astăzi?',
    puncte: 3,
    optiuni: ['Luni', 'Marți', 'Miercuri', 'Joi'],
    raspuns_corect: 'Joi',
  },
  {
    text: 'În ce lună suntem?',
    puncte: 2,
    optiuni: ['Mai', 'Iunie', 'Iulie', 'August'],
    raspuns_corect: 'Iulie',
  },
  {
    text: 'Unde ne aflăm acum?',
    puncte: 3,
    optiuni: ['Acasă', 'Spital', 'Școală', 'Parc'],
    raspuns_corect: 'Școală',
  },
  {
    text: 'Selectează din lista de mai jos cuvintele: ceas, copac, mașină.',
    puncte: 4,
    optiuni: ['Ceas, copac, mașină', 'Carte, copac, masă', 'Ceas, floare, mașină', 'Ceas, copac, calculator'],
    raspuns_corect: 'Ceas, copac, mașină',
  },
  {
    text: 'Care au fost cele 3 cuvinte din întrebarea anterioară?',
    puncte: 4,
    optiuni: ['Ceas, copac, mașină', 'Carte, copac, masă', 'Ceas, floare, mașină', 'Ceas, copac, calculator'],
    raspuns_corect: 'Ceas, copac, mașină',
  },
  {
    text: 'Cât fac 100 minus 7?',
    puncte: 4,
    optiuni: ['93', '94', '92', '97'],
    raspuns_corect: '93',
  },
  {
    text: 'Ce zi vine după miercuri?',
    puncte: 2,
    optiuni: ['Luni', 'Joi', 'Duminică', 'Vineri'],
    raspuns_corect: 'Joi',
  },
  {
    text: 'Ce obiect este în imagine?',
    puncte: 4,
    imagine: '/images/descărcare.jpeg',
    optiuni: ['Telefon', 'Ceas', 'Televizor', 'Pix'],
    raspuns_corect: 'Ceas',
  }
];

function TestMMSEWizard() {
  const [index, setIndex] = useState(0);
  const [raspunsuri, setRaspunsuri] = useState([]);
  const [finalizat, setFinalizat] = useState(false);
  const [scorTotal, setScorTotal] = useState(0);
  const [interpretare, setInterpretare] = useState('');
  const [risc, setRisc] = useState('');
  const [mesaj, setMesaj] = useState('');
const [profil, setProfil] = useState({});

  const intrebare = intrebari[index];

  const handleSelect = (e) => {
    const rasp = [...raspunsuri];
    rasp[index] = e.target.value;
    setRaspunsuri(rasp);
  };

  const handleContinuare = () => {
    const raspunsCurent = raspunsuri[index];
    const esteCorect = raspunsCurent === intrebare.raspuns_corect;
    const punctaj = esteCorect ? intrebare.puncte : 0;

    if (index < intrebari.length - 1) {
      setScorTotal(scorTotal + punctaj);
      setIndex(index + 1);
    } else {
      const scorFinal = scorTotal + punctaj;
      setScorTotal(scorFinal);
      trimiteScorLaBackend(scorFinal);
    }
  };

  const trimiteScorLaBackend = async (scor) => {
  const token = localStorage.getItem('token');

  const raspunsuriFormatate = intrebari.map((intrebare, idx) => ({
    intrebare: intrebare.text,
    raspuns: raspunsuri[idx],
    scor: raspunsuri[idx] === intrebare.raspuns_corect ? intrebare.puncte : 0
  }));

  console.log("Trimitem spre backend:", {
    scor_total: scor,
    raspunsuri: raspunsuriFormatate
  });

  try {
    const response = await fetch('http://localhost:5000/api/teste/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        scor_total: scor,
        varsta: profil.varsta,
        studii: profil.studii,
        boli_cronice: profil.boli_cronice,
        raspunsuri: raspunsuriFormatate
      })

    });

    const data = await response.json();

    if (response.ok) {
      setInterpretare(data.interpretare);
      setRisc(data.nivel_risc);
      setMesaj('Test trimis cu succes!');
    } else {
      setMesaj(data.message || 'Eroare la trimiterea testului.');
    }
  } catch (err) {
    setMesaj('Eroare la server.');
  }

  setFinalizat(true);
};
const synth = window.speechSynthesis;
let utterance;

function citesteIntrebarea() {
  const intrebare = intrebari[index];
  const optiuniText = intrebare.optiuni.join(', ');
  const textDeCitit = `${intrebare.text}. Variantele de răspuns sunt: ${optiuniText}.`;

  synth.cancel(); // oprim orice vorbire anterioară
  utterance = new SpeechSynthesisUtterance(textDeCitit);
  synth.speak(utterance);
}

function togglePauza() {
  if (synth.speaking && !synth.paused) {
    synth.pause(); // dacă se vorbește, pune pe pauză
  } else if (synth.paused) {
    synth.resume(); // dacă e în pauză, reia
  }
}

useEffect(() => {
  window.speechSynthesis.cancel(); // oprește vorbirea la fiecare montare componentă
}, []);

useEffect(() => {
  const fetchProfil = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch("http://localhost:5000/api/profil", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setProfil(data);
  };

  fetchProfil();
}, []);


  if (finalizat) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl text-center">
        <ButonInapoi />
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Test finalizat!</h2>
        <p className="text-lg">Scorul tău: <strong>{scorTotal}</strong> din 30</p>
        {interpretare && (
          <div className="mt-4 text-blue-700">
            <p><strong>Interpretare AI:</strong> {interpretare}</p>
            <p className={`font-semibold ${risc === 'normal' ? 'text-green-500' : risc === 'moderat' ? 'text-yellow-500' : 'text-red-500'}`}>
              <strong>Risc:</strong> {risc}
            </p>

          </div>
        )}
        <p className="mt-4 text-sm text-gray-600">{mesaj}</p>
      
      </div>
    );
    
  }

  return (
  <>
    {/* Fundal video */}
    <div className="fixed inset-0 z-0">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover">
        <source src="/fundal-video.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="fixed inset-0 bg-black/50 z-[1]" />

    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white/10 backdrop-blur-xl shadow-xl rounded-3xl p-8 max-w-3xl w-full text-white animate-fade-in">

        <ButonInapoi />

        {!finalizat ? (
          <>
            <div className="text-sm text-gray-300 mb-2">
              Întrebarea {index + 1} din {intrebari.length}
            </div>
            <p className="mb-2 text-gray-900 text-2xl font-bold mb-4">
              {intrebare.text} <span className="text-sm text-gray-300">(valoare: {intrebare.puncte}p)</span>
            </p>
            
            <button onClick={citesteIntrebarea} className='mr-5 mb-3 text-gray-300'>🔊 Redă întrebarea</button>
            <button onClick={togglePauza} className='text-gray-300'>⏸ Pauză/ Continuă</button>

            {intrebare.imagine && (
              <img
                src={intrebare.imagine}
                alt="Întrebare vizuală"
                className="mb-4 w-48 h-48 object-contain mx-auto rounded-lg shadow-md"
              />
            )}

            <div className="grid gap-3">
              {intrebare.optiuni.map((optiune, idx) => (
                <label
                  key={idx}
                  className={`flex text-gray-800 font-semibold items-center bg-white/10 hover:bg-white/20 transition px-4 py-3 rounded-lg cursor-pointer ${
                    raspunsuri[index] === optiune ? 'ring-2 ring-green-400' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`intrebare-${index}`}
                    value={optiune}
                    checked={raspunsuri[index] === optiune}
                    onChange={handleSelect}
                    className="mr-3"
                  />
                  {optiune}
                </label>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleContinuare}
                disabled={!raspunsuri[index]}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 transition px-6 py-2 rounded-lg font-semibold text-white"
              >
                {index === intrebari.length - 1 ? 'Finalizează testul' : 'Continuă'}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">Rezultatul testului</h2>
            <p className="text-lg mb-2">
              Scor obținut: <span className="text-green-300 font-semibold">{scorTotal} / 30</span>
            </p>
            <p className="text-md text-cyan-300 mb-2">
              Interpretare AI: <span className="font-medium">{interpretare}</span>
            </p>
            {risc && (
              <p className="text-md text-yellow-300">
                Nivel risc: <span className="font-semibold">{risc}</span>
              </p>
            )}
            {mesaj && (
              <div className="mt-4 bg-white/10 p-4 rounded-lg text-white/90">{mesaj}</div>
            )}
          </>
        )}
      </div>
    </div>
  </>
);
}

export default TestMMSEWizard;
