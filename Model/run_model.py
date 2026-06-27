import pickle
import numpy as np

# Load the model
with open('Rand_forest.pkl', 'rb') as file:
    model = pickle.load(file)

# Function to get user input and form the array
def get_input_array():
    print("Enter 6 values (separated by spaces):")
    try:
        # Read and process user input
        user_input = input().strip().split()
        
        if len(user_input) != 6:
            raise ValueError("Please enter exactly 6 values.")
        
        # Convert input to floats
        first_six_values = [float(val) for val in user_input]
        
        # Create a 17-element array with the first 6 values from user input
        input_array = first_six_values + [0] * 11  # Append 11 zeros
        
        return np.array(input_array).reshape(1, -1)  # Reshape to match model input
    except ValueError as e:
        print(f"Invalid input: {e}")
        return None

# Main script
if __name__ == "__main__":
    input_array = get_input_array()
    
    if input_array is not None:
        try:
            # Predict using the model
            prediction = model.predict(input_array)
            diseases_dict={'Fungal infection': 0,
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
            'Impetigo': 40}
            predicted_disease = [key for key, value in diseases_dict.items() if value == prediction]
            print(predicted_disease[0])  # Output: 'Malaria'
        except Exception as e:
            print(f"Error during prediction: {e}")
