from flask_login import UserMixin
from . import db, login_manager

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(length=30), nullable=False, unique=True)
    email = db.Column(db.String(), nullable=False, unique=True)
    pwd = db.Column(db.String(), nullable=False)
    join_date = db.Column(db.DateTime(), nullable=False)

class Loan(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    type = db.Column(db.String(), nullable=False)
    amount = db.Column(db.Integer(), nullable=False)
    interest = db.Column(db.Integer(), nullable=False)
    duration = db.Column(db.Integer(), nullable=False)