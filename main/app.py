#Dependencies
from flask import Flask, render_template, request, session, redirect, flash
import sqlite3 as sql

#For testing

app = Flask(__name__)

#User Vars
loginstate = ["Login", "Logout"]
m_login_state = 0
username = ""

def accountstatus(status):
    global m_login_state
    m_login_state = status
    return

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/')
def index():
    return render_template('index.html', login = loginstate[m_login_state])

@app.route('/login', methods=["GET","POST"])
def login():
    if request.method=="POST":
        #TODO ENCRYPT DATA AND REBOOT DATABASE
        if m_login_state == 0:
            c = sql.connect("data/main.db")
            cur = c.cursor()
            _user = request.form.get("username")
            a = cur.execute("SELECT pass FROM users WHERE user = ?", [_user])
            if request.form.get("password") == a.fetchone()[0]:
                print("Logging user into account")
                accountstatus(1)
            else:
                print("Incorrect Pass")
                return render_template('login.html', login = loginstate[m_login_state])
        return render_template('index.html', login = loginstate[m_login_state])
    else:
        if m_login_state == 1:
            accountstatus(0)
        return render_template('login.html', login = loginstate[m_login_state])

@app.route('/projects', methods=["GET","POST"])
def projects():
    return render_template('projects.html', login = loginstate[m_login_state])

@app.route('/about', methods=["GET","POST"])
def about():
    return render_template('about.html', login = loginstate[m_login_state])
@app.route('/contact', methods=["GET","POST"])
def contact():
    return render_template('contact.html', login = loginstate[m_login_state])

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)