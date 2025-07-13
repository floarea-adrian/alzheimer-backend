const pool = require("../db/connection");

// GET fișa medicală pentru un pacient (medic sau pacient)
const getFisaMedicala = async (req, res) => {
  const id_pacient = req.params.id_pacient;

  try {
    const result = await pool.query(
  `SELECT id_fisa, id_pacient, id_medic, diagnostic, tratament, observatii, boli_cronice AS boli_cronice_pacient,
          investigatii_paraclinice, data_consultatie, nume_medic,
          data_actualizarii
   FROM fise_medicale
   WHERE id_pacient = $1`,
  [id_pacient]
);


    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Fișa medicală nu există." });
    }

    const userResult = await pool.query(
  `SELECT nume, prenume, cnp, varsta, sex, adresa, apartinator, boli_cronice
   FROM utilizatori
   WHERE id_utilizator = $1`,
  [id_pacient]
);

const datePacient = userResult.rows[0];

    
    const testResult = await pool.query(
      `SELECT id_test FROM teste_mmse
      WHERE id_utilizator = $1
      ORDER BY data_test DESC
      LIMIT 1`, [id_pacient]);
      
      let interpretare_ai = null;
      
      if (testResult.rows.length > 0) {
        const id_test = testResult.rows[0].id_test;
        
        const interpretareResult = await pool.query(
    `SELECT concluzie FROM interpretari
     WHERE id_test = $1`, [id_test]);

     if (interpretareResult.rows.length > 0) {
       interpretare_ai = interpretareResult.rows[0].concluzie;
      }
    }
    res.status(200).json({
  ...result.rows[0],
  interpretare_ai,
  date_pacient: datePacient
});
  } catch (err) {
    console.error("Eroare la obținerea fișei medicale:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

// PUT – actualizare fișă de către medic
const updateFisaMedicala = async (req, res) => {
  const id_pacient = req.params.id_pacient;
   const {
    diagnostic,
    tratament,
    observatii,
    boli_cronice,
    investigatii_paraclinice,
    data_consultatie,
    nume_medic,
  } = req.body;

   try {
    const result = await pool.query(
      `UPDATE fise_medicale
       SET diagnostic = $1,
           tratament = $2,
           observatii = $3,
           boli_cronice = $4,
           investigatii_paraclinice = $5,
           data_consultatie = $6,
           nume_medic = $7,
           data_actualizarii = NOW()
       WHERE id_pacient = $8
       RETURNING *`,
      [
        diagnostic,
        tratament,
        observatii,
        boli_cronice,
        investigatii_paraclinice,
        data_consultatie,
        nume_medic,
        id_pacient,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Eroare la actualizarea fișei medicale:", err);
    res.status(500).json({ message: "Eroare la actualizare." });
  }
};

const creeazaFisaMedicala = async (req, res) => {
  const id_pacient = req.params.id_pacient;
  const id_medic = req.utilizator?.id;

  try {
    const verificare = await pool.query(
      "SELECT id_fisa FROM fise_medicale WHERE id_pacient = $1",
      [id_pacient]
    );

    if (verificare.rows.length > 0) {
      return res.status(409).json({ message: "Fișa deja există." });
    }

    const insert = await pool.query(
      `INSERT INTO fise_medicale (id_pacient, id_medic)
       VALUES ($1, $2)
       RETURNING *`,
      [id_pacient, id_medic]
    );

    res.status(201).json({ message: "Fișa a fost creată.", fisa: insert.rows[0] });
  } catch (err) {
    console.error("Eroare creare fișă:", err);
    res.status(500).json({ message: "Eroare la server." });
  }
};

/////////////////////PDF Export Functionality//////////////////////////

const PDFDocument = require("pdfkit");
const axios = require("axios");
const path = require("path");

// Functie utila pt. formatare data
const formatData = (data) => {
  const d = new Date(data);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
};

const exportaPDF = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Date pacient
    const userResult = await pool.query(
      "SELECT nume,prenume, email, varsta FROM utilizatori WHERE id_utilizator = $1",
      [id]
    );
    if (userResult.rows.length === 0)
      return res.status(404).send("Pacientul nu a fost găsit.");
    const pacient = userResult.rows[0];

    // 2. Fișa medicală
    const fisaResult = await pool.query(
  `SELECT t.scor_total, t.data_test, u.boli_cronice
   FROM teste_mmse t
   JOIN utilizatori u ON t.id_utilizator = u.id_utilizator
   WHERE t.id_utilizator = $1
   ORDER BY t.data_test DESC
   LIMIT 1`,
  [id]
);
    if (fisaResult.rows.length === 0)
      return res.status(404).send("Fișa medicală nu a fost găsită.");
    const fisa = fisaResult.rows[0];

    // 3. Istoric scoruri pt. grafic
    const scoruriResult = await pool.query(
  "SELECT data_test, scor_total FROM teste_mmse WHERE id_utilizator = $1 ORDER BY data_test",
  [id]
);

    const labels = scoruriResult.rows.map((row) => formatData(row.data_test));
    const values = scoruriResult.rows.map((row) => row.scor_total);


    // 4. Generăm graficul cu quickchart.io
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
      JSON.stringify({
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Scor MMSE",
              data: values,
              fill: false,
              borderColor: "blue",
              tension: 0.2,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Evoluția scorului MMSE",
          },
        },
      })
    )}`;

    const chartImage = await axios.get(chartUrl, { responseType: "arraybuffer" });

    // 5. Creăm PDF-ul
    const doc = new PDFDocument({ size: "A4", margin: 50 });
let buffers = [];
doc.on("data", buffers.push.bind(buffers));
doc.on("end", () => {
  const pdfData = Buffer.concat(buffers);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=fisa_medicala.pdf");
  res.send(pdfData);
});

// Font și titlu
doc.font("Helvetica-Bold").fontSize(20).text("Fișă medicală - Alzheimer", { align: "center" });
doc.moveDown();

// Date pacient
doc.font("Helvetica").fontSize(12);
doc.text(`Nume: ${pacient.nume} ${pacient.prenume}`);
doc.text(`Email: ${pacient.email}`);
doc.text(`Vârstă: ${pacient.varsta}`);
doc.moveDown();

// Linie separatoare
doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown();

// Fișa medicală
doc.font("Helvetica-Bold").text("Informații Medicale", { underline: true });
doc.moveDown();
doc.text(`Data testării: ${formatData(fisa.data_test)}`);
doc.text(`Scor MMSE: ${fisa.scor_total}/30`);

// Calculăm interpretarea scorului
let interpretare = "";
const scor = fisa.scor_total;
if (scor >= 27) interpretare = "Stare cognitivă normală. Pacientul are dificultăți minore de memorie și concentrare, dar este încă capabil să desfășoare activități cotidiene independente. Necesită monitorizare ocazională.";
else if (scor >= 21) interpretare = "Stadiu moderat de Alzheimer. Pacientul prezintă dificultăți în orientare temporală, memorare pe termen scurt și execuția comenzilor verbale. Necesită supraveghere zilnică."   ;
else interpretare = "Stadiu avansat de Alzheimer. Pacientul are pierderi cognitive majore, nu recunoaște persoane apropiate și necesită asistență permanentă în toate activitățile zilnice.";

const fs = require("fs");
const puppeteer = require("puppeteer");


const templatePath = path.join(__dirname, "../templates/fisa_template.html");
let template = fs.readFileSync(templatePath, "utf-8");

// înlocuim variabilele {{...}} din șablon cu datele reale
template = template
  .replace("{{nume}}", pacient.nume,)
  .replace("{{prenume}}", pacient.prenume)
  .replace("{{email}}", pacient.email)
  .replace("{{varsta}}", pacient.varsta)
  .replace("{{data_test}}", formatData(fisa.data_test))
  .replace("{{scor}}", fisa.scor_total)
  .replace("{{interpretare}}", interpretare)
  .replace("{{boli}}", fisa.boli_cronice || "Nespecificate")
  .replace("{{observatii}}",fisa.observatii || "Nicio observație")
  .replace("{{grafic}}", `data:image/png;base64,${chartImage.data.toString("base64")}`)
  .replace("{{nume_medic}}", fisa.nume_medic || "Nespecificat")
  .replace("{{tratament}}", fisa.tratament || "Nespecificat");

  const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setContent(template, { waitUntil: "networkidle0" });

const pdfBuffer = await page.pdf({ format: "A4" });

await browser.close();

res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "inline; filename=fisa_medicala.pdf");
res.send(pdfBuffer);



// Pagina 2 - Grafic

 } catch (err) {
  console.error("Eroare la generarea PDF:", err.message);
  res.status(500).send("Eroare la generarea PDF");
}
};



module.exports = {
  getFisaMedicala,
  updateFisaMedicala,
  creeazaFisaMedicala,
  exportaPDF
};
