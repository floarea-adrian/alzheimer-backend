const pool = require('../db/connection');
const { spawn } = require('child_process');

const submitTest = async (req, res) => {
  const { scor_total, raspunsuri } = req.body;
  const id_utilizator = req.utilizator.id;

  // Preluăm datele pacientului necesare AI
  const datePacient = await pool.query(
    'SELECT varsta, studii, boli_cronice FROM utilizatori WHERE id_utilizator = $1',
    [id_utilizator]
  );

  const pacient = datePacient.rows[0];

  const varsta = pacient.varsta || 0;
  const studii = pacient.studii || 0;
  const boli = pacient.boli_cronice ? pacient.boli_cronice : "none";
  

  if (!scor_total || isNaN(scor_total)) {
    return res.status(400).json({ message: 'Scorul MMSE este obligatoriu și trebuie să fie un număr.' });
  }

  try {
    // 1. Salvăm scorul în tabela teste_mmse
    const resultTest = await pool.query(
      'INSERT INTO teste_mmse (id_utilizator, scor_total, data_test) VALUES ($1, $2, NOW()) RETURNING id_test',
      [id_utilizator, scor_total]
    );

    const id_test = resultTest.rows[0].id_test;

    // 2. Apelăm scriptul AI
    // const python = spawn('python', [
    //   'ai/ai_model_real.py',
    //   scor_total.toString(),
    //   varsta.toString(),
    //   studii.toString(),
    //   boli.toString()
    // ]);


    // let interpretare = "";
    // let eroarePython = "";

    // python.stdout.on('data', (data) => {
    //   interpretare += data.toString();
    // });

    // python.stderr.on('data', (data) => {
    //   eroarePython += data.toString();
    // });

    // python.on('close', async (code) => {
    //   interpretare = interpretare.trim();

    //   if (eroarePython) {
    //     console.error('Eroare Python:', eroarePython);
    //     return res.status(500).json({ message: 'Eroare în interpretarea AI.' });
    //   }

    //   if (!interpretare) {
    //     console.error("⚠️ Nicio interpretare primită de la AI.");
    //     return res.status(500).json({ message: 'Interpretare goală de la AI.' });
    //   }


    //   let nivel_risc = 'necunoscut';
    //   if (scor_total >= 27) nivel_risc = 'normal';
    //   else if (scor_total >= 21) nivel_risc = 'moderat';
    //   else nivel_risc = 'sever';

    //   // 3. Salvăm interpretarea
    //   await pool.query(
    //     'INSERT INTO interpretari (id_test, concluzie, sugestie) VALUES ($1, $2, $3)',
    //     [id_test, interpretare, nivel_risc]
    //   );

    // ... AI interpretare ...
const interpretare = await new Promise((resolve, reject) => {
  const python = spawn('python', [
    'ai/ai_model_real.py',
    scor_total.toString(),
    varsta.toString(),
    studii.toString(),
    boli.toString()
  ]);

  let rezultat = '';
  let eroare = '';

  python.stdout.on('data', (data) => {
    rezultat += data.toString();
  });

  python.stderr.on('data', (data) => {
    eroare += data.toString();
  });

  python.on('close', (code) => {
     if (code !== 0) {
  console.error("Eroare Python:", eroare);
  return reject(new Error("Eroare în interpretarea AI"));
}

// Doar pentru debug:
if (eroare) {
  console.warn("⚠️ AVERTISMENT din Python:", eroare);
}

    // Extragem DOAR ultima linie negoală (concluzia AI)
  const linii = rezultat.trim().split('\n').filter(l => l.trim() !== '');
  const ultima = linii[linii.length - 1];
  resolve(ultima);

  });
});

let nivel_risc = 'necunoscut';
if (scor_total >= 27) nivel_risc = 'normal';
else if (scor_total >= 21) nivel_risc = 'moderat';
else nivel_risc = 'sever';
const interpretareCurata = interpretare.normalize("NFKD").replace(/[^\x00-\x7F]/g, '');

console.log("📌 Salvăm în DB: ", { id_test, interpretare, nivel_risc });

// Salvăm interpretarea în DB
await pool.query(
  'INSERT INTO interpretari (id_test, concluzie, sugestie) VALUES ($1, $2, $3)',
  [id_test, interpretareCurata, nivel_risc]
);

// Salvăm răspunsurile
if (Array.isArray(raspunsuri)) {
  for (const r of raspunsuri) {
    await pool.query(
      "INSERT INTO raspunsuri_mmse (id_test, intrebare, raspuns, punctaj) VALUES ($1, $2, $3, $4)",
      [id_test, r.intrebare, r.raspuns, r.scor]
    );
  }
}

// Răspuns final
res.status(201).json({
  message: 'Test complet salvat.',
  scor_total,
  interpretare,
  nivel_risc,
  id_test
});

  } catch (err) {
    console.error('Eroare la salvare test:', err);
    res.status(500).json({ message: 'Eroare la server.' });
  }
};

module.exports = { submitTest };


/ISTORIC TESTE////////

const getIstoricTeste = async (req, res) => {
  const id_utilizator = req.utilizator.id;
  
  // console.log("✅ getIstoricTeste a fost apelată pentru utilizatorul:", id_utilizator);
  try {
    const result = await pool.query(`
      SELECT t.id_test, t.scor_total, t.data_test, i.concluzie AS interpretare, i.sugestie AS nivel_risc
      FROM teste_mmse t
      LEFT JOIN interpretari i ON t.id_test = i.id_test
      WHERE t.id_utilizator = $1
      ORDER BY t.data_test DESC
    `, [id_utilizator]);

    res.json(result.rows );

  } catch (err) {
    console.error('Eroare la extragerea istoricului:', err);
    res.status(500).json({ message: 'Eroare la server.' });
  }
};

const getListaPacienti = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_utilizator, nume, prenume, email, avatar
      FROM utilizatori
      WHERE rol = 'pacient'
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la extragerea pacienților:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

//
const getIstoricPacient = async (req, res) => {
  const id_pacient = req.params.id_pacient;

  try {
    const result = await pool.query(`
      SELECT t.id_test, t.scor_total, TO_CHAR(data_test, 'YYYY-MM-DD') as data_test, i.concluzie AS interpretare, i.sugestie AS nivel_risc
      FROM teste_mmse t
      LEFT JOIN interpretari i ON t.id_test = i.id_test
      WHERE id_utilizator = $1
      ORDER BY data_test DESC
    `, [id_pacient]);

    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la extragere scoruri:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

//salveaza raspunsurile testului MMSE


const salveazaTest = async (req, res) => {
  try {
    const { id_pacient, scor_total, nivel_risc, interpretare, raspunsuri } = req.body;

    // 1. Salvăm testul principal și obținem id_test
    const result = await pool.query(
      "INSERT INTO teste (id_pacient, scor_total, nivel_risc, interpretare, data) VALUES ($1, $2, $3, $4, NOW()) RETURNING id_test",
      [id_pacient, scor_total, nivel_risc, interpretare]
    );

    const id_test = result.rows[0].id_test;

    // 2. Salvăm răspunsurile
    for (const r of raspunsuri) {
      await pool.query(
        "INSERT INTO raspunsuri_test (id_test, intrebare, raspuns, scor) VALUES ($1, $2, $3, $4)",
        [id_test, r.intrebare, r.raspuns, r.scor]
      );
    }

    res.status(201).json({ message: "Test salvat cu succes", id_test });
  } catch (err) {
    console.error("Eroare la salvare test:", err);
    res.status(500).json({ message: "Eroare la salvare test" });
  }
};


//raspunsuri test 

const getRaspunsuriTest = async (req, res) => {
  const id_test = req.params.id_test;

  try {
    const result = await pool.query(`
      SELECT intrebare, raspuns, punctaj
      FROM raspunsuri_mmse
      WHERE id_test = $1
    `, [id_test]);

    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la extragerea răspunsurilor:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};



module.exports = {submitTest, getListaPacienti, getIstoricPacient, getRaspunsuriTest, salveazaTest, getIstoricTeste };
