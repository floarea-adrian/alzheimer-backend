import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import tensorflow as tf
import numpy as np

# Verificăm dacă avem suficiente argumente
if len(sys.argv) < 5:
    print("Date insuficiente")
    sys.exit(1)

# Preluăm argumentele
scor = float(sys.argv[1])
varsta = float(sys.argv[2])
studii = int(sys.argv[3])
boli_text = sys.argv[4].lower()

# Codificăm bolile cronice ca binar (1 = are, 0 = nu are)
are_boli = 0 if boli_text in ["", "none", "nu", "nicio"] else 1

# Creăm inputul pentru AI (reshape pt 1 rând, 4 coloane)
input_data = np.array([[scor, varsta, studii, are_boli]], dtype=float)

# Încărcăm modelul antrenat
model = tf.keras.models.load_model('ai/model_mmse.h5')

# Obținem predicția
predictie = model.predict(input_data)
print("DEBUG - predictie:", predictie)

eticheta = int(np.argmax(predictie))  # presupunem că modelul returnează one-hot
print("DEBUG - eticheta:", eticheta)

# Mapare etichetă → concluzie
concluzii = {
    0: "Stadiu avansat de Alzheimer. Pierderi cognitive majore, necesită îngrijire permanentă.",
    1: "Stadiu moderat. Probleme cu orientarea temporală și memoria pe termen scurt.",
    2: "Stare cognitivă normală. Doar dificultăți minore, dar necesită monitorizare periodică."
}
print("DEBUG - concluzie:", concluzii)

# Afișăm concluzia finală
print(concluzii.get(eticheta, "Interpretare necunoscută"))
