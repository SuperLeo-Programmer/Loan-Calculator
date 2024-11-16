from flask import flash, render_template, request, redirect, url_for
from flask_login import login_user

from loan_calculator.functions import AuthenticateUser, CreateUser, HashPassword
from . import app

@app.route("/auth", methods=["GET", "POST"])
def auth():
    if request.method == "POST":
        if "loginForm" in request.form:
            username = request.form.get("username")
            pwd = request.form.get("pwd")

            user = AuthenticateUser(username, pwd)
            
            if user != False:
                login_user(user)
                flash(message="You have been logged in successfully!", category="success")
                return redirect(url_for('expenses'))
            else:
                flash(message="Invalid credentials", category="danger")

        if "registerForm" in request.form:
            username = request.form.get("username")
            email = request.form.get("email")
            pwd = request.form.get("pwd")
            pwd_confirm = request.form.get("pwd-confirm")

            if pwd != pwd_confirm:
                flash("Password not equal to password confirm")
                return

            hash_pwd = HashPassword(pwd)
            msg, category = CreateUser(username, email, hash_pwd)

            flash(message=msg, category=category)
            return redirect(url_for('expenses'))

    return render_template("auth.html")
