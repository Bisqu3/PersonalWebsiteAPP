#Dependencies
from flask import Flask, render_template, request
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

app = Flask(__name__)

#User Vars
username = ""

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)