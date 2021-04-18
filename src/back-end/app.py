import json
from flask import Flask, jsonify, request, session, redirect, make_response
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS, cross_origin
from database import Database
import sqlite3
from models import Student
from functools import wraps
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
cors = CORS(app)

db = Database()

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'vassa'


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        data = jwt.decode(token, app.config['SECRET_KEY'])
        current_user = 'select name from Users where userID = ?', data['id'].first()  
        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/authTest', methods=['GET'])
@token_required
@cross_origin()
def authTest(current_user):
    return jsonify({'Data': 'You are authed'})


@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    auth = request.json

    if(auth['email'] and auth['password']):
        user = db.query_single(
            'select * from users where email = ?', [auth['email']])

        if(user):
            return {'error': 'Email is already in use'}, 400

        hashed_password = generate_password_hash(auth['password'])

        db.execute('insert into users(name, email, password) values(?, ?, ?)', [
                   auth['name'], auth['email'], hashed_password])

        return jsonify({'data': 'Successfully registered'})

    else:
        return {'error': 'Must provide email and password to register'}, 400


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    auth = request.json

    if(auth['email'] is None or auth['password']):

        user = db.query_single(
            'select userID, name, email, password from users where email = ?', [auth['email']])

        if not user:
            return jsonify({'error': 'No records found for email'}, 401)

        if check_password_hash(user[3], auth['password']):
            token = jwt.encode({'Id': user[0], 'exp': datetime.utcnow(
            ) + timedelta(minutes=30)}, app.config['SECRET_KEY']).decode("utf-8")
            return jsonify({'token': token})
    else:
        return jsonify({'Error': 'Need to provide credentials'})


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')