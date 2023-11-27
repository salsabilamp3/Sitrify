from flask_pymongo import PyMongo
from app import app

mongo = PyMongo(app)

def create_user(id_artist, username, password):
    collection = mongo.db.users
    user = {
        'id_artist': id_artist,
        'username': username,
        'password': password
    }
    collection.insert_one(user)

def get_all_users():
    collection = mongo.db.users
    print("collection", collection)
    users = list(collection.find({}, {'_id': 0}))  # Menggunakan list() untuk mengubah kursor menjadi daftar
    return {"users": users}

def get_user(username):
    collection = mongo.db.users
    user = collection.find_one({'username': username})
    return user

def get_user_by_id(id_artist):
    collection = mongo.db.artists
    user = collection.find_one({'id': id_artist})
    return user