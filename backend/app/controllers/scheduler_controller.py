from datetime import datetime
from flask_pymongo import PyMongo
from app import app
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

mongo = PyMongo(app)

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="6301e01d6e834c45b78ce16edf5e110f",
                                                              client_secret="b72c6f398c684d0ca159f8d3d8c68f67"))

def retrieveTop50Global():
    results = sp.playlist_tracks("37i9dQZEVXbMDoHDwVN2tF")
    tracks = results['items']
    while results['next']:
        results = sp.next(results)
        tracks.extend(results['items'])
    formatted_tracks = []

    for i, track in enumerate(tracks, start=1):
        artists = []
        for artist in track['track']['artists']:
            artists.append({
                'id': artist['id'],
                'name': artist['name']
            })

        formatted_track = {
            'ranking': str(i),
            'artist': artists,
            'id_song': track['track']['id'],
            'song_name': track['track']['name'],
            'image': track['track']['album']['images'][0]['url']
        }

        # Mendapatkan audio features untuk setiap lagu
        audio_features = sp.audio_features([formatted_track['id_song']])[0]

        # Menambahkan fitur audio ke dalam formatted_track
        formatted_track['audio_features'] = {
            'acousticness': audio_features['acousticness'],
            'danceability': audio_features['danceability'],
            'energy': audio_features['energy'],
            'instrumentalness': audio_features['instrumentalness'],
            'speechiness': audio_features['speechiness'],
            'liveness': audio_features['liveness'],
            'loudness': audio_features['loudness'],
            'valence': audio_features['valence']
        }

        formatted_tracks.append(formatted_track)

    return formatted_tracks

def saveCharts(data):
    timestamp = datetime.now().strftime("%Y-%m-%d")

    document = {
        'timestamp': timestamp,
        'chart_songs': data
    }

    mongo.db.charts.insert_one(document)

    print('Charts berhasil disimpan at ' + timestamp)

def retrieveArtistInfo():
    artists = mongo.db.artists.find({}, {'_id': 0})
    updated_artist_data = []

    for artist in artists:
        artist_id = artist['id']
        artist_info = sp.artist(artist_id)

        # Mendapatkan timestamp saat ini
        timestamp = datetime.utcnow().strftime('%Y-%m-%d')

        # Menyiapkan data followers dan popularity
        followers_popularity_data = {
            'followers': artist_info['followers']['total'],
            'popularity': artist_info['popularity'],
            'timestamp': timestamp
        }

        # Mengupdate informasi artist
        mongo.db.artists.update_one({'id': artist_id}, {'$set': {
            'genres': artist_info['genres'],
            'image': artist_info['images'][0]['url']
        }})

        # Menambahkan followers_popularity_data ke dalam array
        mongo.db.artists.update_one({'id': artist_id}, {'$push': {'followers_popularity': followers_popularity_data}})

        # print('Informasi ' + artist['name'] + ' berhasil diupdate')

        # Mengambil data yang telah diperbarui
        updated_artist = mongo.db.artists.find_one({'id': artist_id}, {'_id': 0})
        updated_artist_data.append(updated_artist)

    print('Informasi artist berhasil diperbarui')

