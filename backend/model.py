import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB
import joblib

# Load dataset
data = pd.read_csv('diabetes.csv')

# Preprocessing Data
X = data.drop('Outcome', axis=1)
y = data['Outcome']

# Normalize Data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Initialize the model
model = GaussianNB()

# Train the model
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'diabetes_model.pkl')