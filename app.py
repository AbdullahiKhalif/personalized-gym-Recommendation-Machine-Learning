from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from joblib import load
import mysql.connector
import re
app = Flask(__name__)

# Load your models
decision_tree_regression_model = load('models/decision_tree_regressor.joblib')
decision_tree_classification_model = load('models/decision_tree_classifier.joblib')

app = Flask(__name__)
app.secret_key = "xtay6UY&"

# MySQL configurations
mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'gym_recommendation'
}

@app.route('/')
def index():
    if 'username' in session:
        return render_template('index.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            session['username'] = user['fullName']
            session['email'] = user['email']
            session['address'] = user['address']
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Sorry Invalid email or password')

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['fullName']
        address = request.form['address']
        email = request.form['email']
        password = request.form['password']

        # Check if the name is valid
        if not is_valid_name(name):
            return render_template('signup.html', error='Invalid name. Please enter a valid name.')

        # Check if email already exists
        conn = mysql.connector.connect(**mysql_config)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            cursor.close()
            conn.close()
            return render_template('signup.html', error='Sorry!. his email already exists')

        # Insert user into database
        cursor.execute("INSERT INTO users (fullName, address, email, password) VALUES (%s, %s, %s, %s)", (name, address,email, password))
        conn.commit()
        cursor.close()
        conn.close()

        # session['username'] = name
        return redirect(url_for('login'))
    return render_template('signup.html')

def is_valid_name(name):
    # Add your validation logic here, for example:
    # Name should contain only alphabets and spaces
    return bool(re.match("^[a-zA-Z ]+$", name))

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/predict', methods=['POST'])
def predict():
    if 'username' not in session:
        return redirect(url_for('login'))
    # Get input values from the form
    features = [float(request.form[feature]) for feature in ['sex', 'Age', 'Height', 'Weight', 'hypertension', 'diabetes']]

    # Make predictions using the models
    bmi_prediction = decision_tree_regression_model.predict([features])[0]
    fitness_recommendation = decision_tree_classification_model.predict([features])[0]

    # Convert NumPy arrays to Python lists
    bmi_prediction_list = bmi_prediction.tolist()
    fitness_recommendation_list = fitness_recommendation.tolist()

    # Check if prediction exists
    if bmi_prediction_list is not None and fitness_recommendation_list is not None:
        # Return prediction results as JSON data
        return jsonify(username = session['username'], email = session['email'], address= session['address'], bmi_prediction=bmi_prediction_list, fitness_recommendation=fitness_recommendation_list)
    else:
        # Return error if prediction failed
        return jsonify(error="Prediction failed"), 500

if __name__ == '__main__':
    app.run(debug=True)
