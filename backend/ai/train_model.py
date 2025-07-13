# import pandas as pd
# import tensorflow as tf
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense
# from tensorflow.keras.utils import to_categorical

# # 1. Încărcăm datele
# df = pd.read_csv('dataset.csv')

# # 2. Separăm features și etichete
# X = df[['scor_mmse', 'varsta', 'studii', 'boli']]
# y = to_categorical(df['eticheta'], num_classes=3)

# # 3. Normalizare
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # 4. Împărțim datele
# X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# # 5. Creăm modelul
# model = tf.keras.Sequential([
#     tf.keras.layers.Dense(16, activation='relu', input_shape=(4,)),
#     tf.keras.layers.Dense(12, activation='relu'),
#     tf.keras.layers.Dense(3, activation='softmax')
# ])


# model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# # 6. Antrenăm modelul
# model.fit(X_train, y_train, epochs=50, batch_size=8, validation_data=(X_test, y_test))

# # 7. Salvăm modelul
# model.save('ai/model_mmse.h5', save_format='h5')
# print("✅ Model salvat cu succes în model_mmse.keras")
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.utils import to_categorical

# 1. Încărcare date
df = pd.read_csv('dataset.csv')
X = df[['scor_mmse', 'varsta', 'studii', 'boli']]
y = to_categorical(df['eticheta'], num_classes=3)

# 2. Normalizează
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Împarte date
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 4. Model compatibil Functional API (fără InputLayer)
inputs = tf.keras.Input(shape=(4,))
x = tf.keras.layers.Dense(16, activation='relu')(inputs)
x = tf.keras.layers.Dense(12, activation='relu')(x)
outputs = tf.keras.layers.Dense(3, activation='softmax')(x)
model = tf.keras.Model(inputs=inputs, outputs=outputs)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 5. Antrenează
model.fit(X_train, y_train, epochs=50, batch_size=8, validation_data=(X_test, y_test))

# 6. Salvează modelul în format clasic
model.save('ai/model_mmse.h5', save_format='h5')
print("✅ Model salvat cu succes în ai/model_mmse.h5")
