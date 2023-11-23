from flask import Blueprint, jsonify, request
from app.controllers.songs_controller import get_all_artists_songs, get_song_audio_features

songs_route = Blueprint('songs_route', __name__, url_prefix='/api')

@songs_route.route('/songs/<id_artist>', methods=['GET'])
def get_songs(id_artist):
    songs = get_all_artists_songs(id_artist)
    return jsonify(songs)

@songs_route.route('/songs/audio-features/<id_song>', methods=['GET'])
def get_audio_features(id_song):
    audio_features = get_song_audio_features(id_song)
    return jsonify(audio_features)