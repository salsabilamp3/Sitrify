from flask_pymongo import PyMongo
from app import app
from flask import jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

mongo = PyMongo(app)

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="6301e01d6e834c45b78ce16edf5e110f",
                                                              client_secret="b72c6f398c684d0ca159f8d3d8c68f67"))

def get_all_artists_songs(id_artist):
    songs_collection = mongo.db.songs
    songs_data = list(songs_collection.find({'id_artist': id_artist}, {'_id': 0, 'songs': 1}))

    # Mengekstrak langsung daftar lagu dari setiap dokumen
    songs_list = [song for data in songs_data for song in data.get('songs', [])]

    # Mengembalikan hasil dengan properti 'songs' yang sudah diekstrak
    return {"songs": songs_list}

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
    