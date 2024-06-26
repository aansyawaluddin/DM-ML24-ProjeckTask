from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

model_path = os.path.join('training model', 'diabetes.pkl')
transformer_path = os.path.join('training model', 'transformer.pkl')

if not os.path.exists(model_path):
    print(f"File {model_path} tidak ditemukan.")
else:
    model = joblib.load(model_path)

if not os.path.exists(transformer_path):
    print(f"File {transformer_path} tidak ditemukan.")
else:
    transformer = joblib.load(transformer_path)

def set_new_bmi(row):
    if row["BMI"] < 18.5:
        return "Underweight"
    elif 18.5 <= row["BMI"] <= 24.9:
        return "Normal"
    elif 24.9 < row["BMI"] <= 29.9:
        return "Overweight"
    elif 29.9 < row["BMI"] <= 34.9:
        return "Obesity 1"
    elif 34.9 < row["BMI"] <= 39.9:
        return "Obesity 2"
    else:
        return "Obesity 3"

def set_insulin(row):
    return "Normal" if 16 <= row["Insulin"] <= 166 else "Abnormal"

def set_new_glucose(row):
    if row["Glucose"] <= 70:
        return "Low"
    elif 70 < row["Glucose"] <= 99:
        return "Normal"
    elif 99 < row["Glucose"] <= 126:
        return "Overweight"
    else:
        return "High"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = data['features']
        input_df = pd.DataFrame([features], columns=[
            "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
            "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
        ])


        input_df['NewBMI'] = input_df.apply(set_new_bmi, axis=1)
        input_df['NewInsulinScore'] = input_df.apply(set_insulin, axis=1)
        input_df['NewGlucose'] = input_df.apply(set_new_glucose, axis=1)
        
        input_df = pd.get_dummies(input_df, columns=["NewBMI", "NewInsulinScore", "NewGlucose"], drop_first=True)
        
        expected_columns = [
            "Pregnancies", "Glucose", "BloodPressure", "SkinThickness", 
            "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
        ]
        
        categorical_columns = [
            'NewBMI_Obesity 1', 'NewBMI_Obesity 2', 'NewBMI_Obesity 3', 'NewBMI_Overweight',
            'NewBMI_Underweight', 'NewInsulinScore_Normal', 'NewGlucose_Low',
            'NewGlucose_Normal', 'NewGlucose_Overweight', 'NewGlucose_Secret'
        ]
        
        for col in categorical_columns:
            if col not in input_df.columns:
                input_df[col] = 0
        
        numerical_features = input_df[expected_columns]
        
        scaled_numerical_features = transformer.transform(numerical_features)
        
        scaled_numerical_df = pd.DataFrame(scaled_numerical_features, columns=expected_columns)
        
        final_df = pd.concat([scaled_numerical_df, input_df[categorical_columns]], axis=1)

        final_df = final_df[expected_columns + categorical_columns]

        prediction = model.predict(final_df)

        # print(prediction)
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)