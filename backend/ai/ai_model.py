# import sys
# import io

# # Setăm UTF-8 pentru consola standard
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# def interpreteaza_mmse(scor):
#     scor = int(scor)
#     if scor >= 27:
#         return "Stare cognitivă normală. Pacientul are dificultăți minore de memorie și concentrare, dar este încă capabil să desfășoare activități cotidiene independente. Necesită monitorizare ocazională."
#     elif scor >= 21:
#         return "Stadiu moderat de Alzheimer. Pacientul prezintă dificultăți în orientare temporală, memorare pe termen scurt și execuția comenzilor verbale. Necesită supraveghere zilnică."   
#     elif scor >= 0:
#         return "Stadiu avansat de Alzheimer. Pacientul are pierderi cognitive majore, nu recunoaște persoane apropiate și necesită asistență permanentă în toate activitățile zilnice."
    

# if __name__ == "__main__":
#     scor = sys.argv[1]
#     print(interpreteaza_mmse(scor))  
