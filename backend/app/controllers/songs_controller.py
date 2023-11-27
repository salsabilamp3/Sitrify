from flask_pymongo import PyMongo
from app import app
from tensorflow.keras.models import load_model
import numpy as np
import pandas as pd
import os
from flask import jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from sklearn.preprocessing import StandardScaler

# Splitting the dataset into the Training set and Test set
def preprocessing_Standard(path):
    df = pd.read_csv(path)
    df = df.drop(['track_id'], axis=1)
    df = df.drop(['track'], axis=1)
    df = df.drop(['artist'], axis=1)
    # process the artist into a number
    X = df.iloc[:, :-1].values
    y = df.iloc[:, -1].values
    # Splitting the dataset into the Training set and Test set
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)
    return X_train



mongo = PyMongo(app)

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="6301e01d6e834c45b78ce16edf5e110f",
                                                              client_secret="b72c6f398c684d0ca159f8d3d8c68f67"))

script_directory = os.path.dirname(os.path.realpath(__file__))
model_path = os.path.join(script_directory, 'best_model_v3.h5')
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
        data["danceability"],
        data["energy"],
        data["loudness"],
        data["speechiness"],
        data["acousticness"],
        data["instrumentalness"],
        data["liveness"],
        data["valence"]
    ]
    # Assuming preprocessing_Standard is a function to load the dataset, replace it with your actual preprocessing logic
    Standarization_reference = preprocessing_Standard('dataset.csv')
    scaler = StandardScaler()
    scaler.fit(Standarization_reference)
    
    # Use the provided scaler to transform the data
    audio_features = np.array(audio_features).reshape(1, -1)
    audio_features = scaler.transform(audio_features)

    prediction = model.predict(audio_features)
    print("prediction: ", prediction)

    prediction = (prediction > 0.5)

    print(prediction)

    # Mengembalikan hasil prediksi
    return prediction    