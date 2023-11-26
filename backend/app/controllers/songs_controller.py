from flask_pymongo import PyMongo
from app import app
from keras.models import load_model
import numpy as np
import os
from flask import jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

mongo = PyMongo(app)

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="6301e01d6e834c45b78ce16edf5e110f",
                                                              client_secret="b72c6f398c684d0ca159f8d3d8c68f67"))

script_directory = os.path.dirname(os.path.realpath(__file__))
model_path = os.path.join(script_directory, 'best_model.h5')
model = load_model(model_path)

def get_all_artists_songs(id_artist):
    songs_collection = mongo.db.songs
    songs_data = list(songs_collection.find({'id_artist': id_artist}, {'_id': 0, 'songs': 1}))

    # Mengekstrak langsung daftar lagu dari setiap dokumen
    songs_list = [song for data in songs_data for song in data.get('songs', [])]

    # Mengembalikan hasil dengan properti 'songs' yang sudah diekstrak
    return {"songs": songs_list}

def get_song_by_id(id_song):
    songs_collection = mongo.db.songs
    song_data = songs_collection.find_one({'songs.id_song': id_song}, {'_id': 0, 'songs': {'$elemMatch': {'id_song': id_song}}})
    return song_data

def get_song_audio_features(id_song):
    results = sp.audio_features([id_song])
    audio_features = results[0]
    selected_features = {
        "acousticness": audio_features["acousticness"],
        "danceability": audio_features["danceability"],
        "energy": audio_features["energy"],
        "speechiness": audio_features["speechiness"],
        "instrumentalness": audio_features["instrumentalness"],
        "liveness": audio_features["liveness"],
        "loudness": audio_features["loudness"],
        "valence": audio_features["valence"]
    }
    return selected_features

def predict_song(data):
    audio_features = [
        data["acousticness"],
        data["danceability"],
        data["speechiness"],
        data["energy"],
        data["instrumentalness"],
        data["liveness"],
        data["loudness"],
        data["valence"]
    ]

    prediction = model.predict(np.array([audio_features]))

    prediction = (prediction > 0.5)

    print(prediction)

    # Mengembalikan hasil prediksi
    return prediction    