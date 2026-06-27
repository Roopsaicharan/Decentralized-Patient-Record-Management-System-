from flask import Flask, request, jsonify
import numpy as np
from joblib import load
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# if haveing trouble in import use the control+shift+p and select python312

diseases_dict = {
    'Fungal infection': 0,
    'Allergy': 1,
    'GERD': 2,
    'Chronic cholestasis': 3,
    'Drug Reaction': 4,
    'Peptic ulcer diseae': 5,
    'AIDS': 6,
    'Diabetes': 7,
    'Gastroenteritis': 8,
    'Bronchial Asthma': 9,
    'Hypertension': 10,
    'Migraine': 11,
    'Cervical spondylosis': 12,
    'Paralysis (brain hemorrhage)': 13,
    'Jaundice': 14,
    'Malaria': 15,
    'Chicken pox': 16,
    'Dengue': 17,
    'Typhoid': 18,
    'hepatitis A': 19,
    'Hepatitis B': 20,
    'Hepatitis C': 21,
    'Hepatitis D': 22,
    'Hepatitis E': 23,
    'Alcoholic hepatitis': 24,
    'Tuberculosis': 25,
    'Common Cold': 26,
    'Pneumonia': 27,
    'Dimorphic hemmorhoids(piles)': 28,
    'Heart attack': 29,
    'Varicose veins': 30,
    'Hypothyroidism': 31,
    'Hyperthyroidism': 32,
    'Hypoglycemia': 33,
    'Osteoarthristis': 34,
    'Arthritis': 35,
    '(vertigo) Paroymsal  Positional Vertigo': 36,
    'Acne': 37,
    'Urinary tract infection': 38,
    'Psoriasis': 39,
    'Impetigo': 40
}

# Load the trained model
model = load('Rand_forest.pkl')  # Ensure the model file exists

# Function to map ID to disease name
def get_disease_name(disease_id):
    for disease, id in diseases_dict.items():
        if id == disease_id:
            return disease
    return "Unknown Disease"  # In case of an invalid ID

# Define a route for predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        data = request.json
        symptoms = data.get('symptoms', [])

        # Validate input (ensure it's a list of integers)
        if not all(isinstance(i, int) for i in symptoms) or len(symptoms) != 17:
            return jsonify({"error": "Invalid input. Provide 17 integer symptom values."}), 400

        # Convert to numpy array and reshape for prediction
        input_array = np.array(symptoms).reshape(1, -1)

        # Predict using the loaded model
        prediction_id = model.predict(input_array)[0]  # Get the predicted disease ID

        # Map the ID to the disease name
        disease_name = get_disease_name(prediction_id)

        # Return the prediction as JSON
        return jsonify({"prediction": disease_name})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
