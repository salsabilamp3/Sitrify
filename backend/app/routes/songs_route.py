from flask import Blueprint, jsonify, request
from app.controllers.songs_controller import get_all_artists_songs, get_song_audio_features, get_song_by_id, predict_song

songs_route = Blueprint('songs_route', __name__, url_prefix='/api')

@songs_route.route('/songs/<id_artist>', methods=['GET'])
def get_songs(id_artist):
    songs = get_all_artists_songs(id_artist)
    return jsonify(songs)

@songs_route.route('/song/<id_song>', methods=['GET'])
def get_song(id_song):
    song = get_song_by_id(id_song)
    return jsonify(song)

@songs_route.route('/song/audio-features/<id_song>', methods=['GET'])
def get_audio_features(id_song):
    audio_features = get_song_audio_features(id_song)
    return jsonify(audio_features)

@songs_route.route('/song/predict/<id_song>', methods=['GET'])
def predict(id_song):
    try:
        audio_features = get_song_audio_features(id_song)
        prediction = predict_song(audio_features)
        result = {"prediction": bool(prediction)}

        return jsonify(result)

    except Exception as e:
        # Log the exception for debugging purposes
        print(f"Error predicting song: {str(e)}")

        # Return an error response
        return jsonify({"error": "Internal Server Error"}), 500