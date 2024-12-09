from flask import Flask, jsonify, render_template, redirect, url_for
from sqlalchemy import create_engine, text

# Initialize Flask app
app = Flask(__name__)

# Database configuration
DATABASE_URI = 'sqlite:///trends_dashboard.db'  # Replace with your database URI
engine = create_engine(DATABASE_URI)

# Routes
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/catalog')
def catalog():
    return render_template('catalog.html')

@app.route('/predict')
def predict():
    return render_template('predict.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

@app.route('/history')
def history():
    return render_template('history.html')

# API Routes
@app.route('/api/delivery_share')
def get_delivery_share():
    query = "SELECT category, percentage FROM delivery_share;"
    with engine.connect() as connection:
        result = connection.execute(text(query)).fetchall()
    data = [{'category': row[0], 'percentage': row[1]} for row in result]
    return jsonify(data)

@app.route('/api/freshness_selling')
def get_freshness_selling():
    query = "SELECT product, sales FROM freshness_selling;"
    with engine.connect() as connection:
        result = connection.execute(text(query)).fetchall()
    data = [{'product': row[0], 'sales': row[1]} for row in result]
    return jsonify(data)

@app.route('/api/brands_performance')
def get_brands_performance():
    query = "SELECT brand, performance_score FROM brands_performance;"
    with engine.connect() as connection:
        result = connection.execute(text(query)).fetchall()
    data = [{'brand': row[0], 'performance_score': row[1]} for row in result]
    return jsonify(data)

@app.route('/api/average_freshness')
def get_average_freshness():
    query = "SELECT freshness_score FROM average_freshness;"
    with engine.connect() as connection:
        result = connection.execute(text(query)).fetchall()
    data = [{'freshness_score': row[0]} for row in result]
    return jsonify(data)

@app.route('/api/products_tested')
def get_products_tested():
    query = "SELECT date, products_tested FROM products_tested_per_day;"
    with engine.connect() as connection:
        result = connection.execute(text(query)).fetchall()
    data = [{'date': row[0], 'products_tested': row[1]} for row in result]
    return jsonify(data)

@app.route('/api/manufacturing_categories')
def get_manufacturing_categories():
    query = "SELECT category, count FROM manufacturing_categories;"
    with engine.connect() as connection:
        result = connection.execute(text(query)).fetchall()
    data = [{'category': row[0], 'count': row[1]} for row in result]
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
