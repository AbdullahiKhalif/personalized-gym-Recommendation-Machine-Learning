from flask import Flask, render_template, request
from joblib import load

app = Flask(__name__)

# Load your models
decision_tree_regression_model = load('models/decision_tree_regressor.joblib')
decision_tree_classification__model = load('models/decision_tree_classifier.joblib')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get input values from the form
    features = [float(request.form[feature]) for feature in ['sex', 'Age', 'Height', 'Weight', 'hypertension', 'diabetes']]

    # Make predictions using the models
    bmi_prediction = decision_tree_regression_model.predict([features])[0]
    fitness_recommendation = decision_tree_classification__model.predict([features])[0]

    # Pass the predictions to the result template
    return render_template('result.html', bmi_prediction=bmi_prediction, fitness_recommendation=fitness_recommendation)

if __name__ == '__main__':
    app.run(debug=True)
