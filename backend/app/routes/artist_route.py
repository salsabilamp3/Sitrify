from flask import Blueprint, jsonify, request
from app.controllers.artist_controller import get_all_artists, get_artist_by_id, get_todays_artists

artist_route = Blueprint('artist_route', __name__, url_prefix='/api')

@artist_route.route('/artist', methods=['GET'])
def get_all_artists_route():
    artists = get_all_artists()
    return jsonify(artists)

@artist_route.route('/artist/<artist_id>', methods=['GET'])
def get_artist_by_id_route(artist_id):
    artist = get_artist_by_id(artist_id)
    if artist:
        return jsonify(artist)
    else:
        return jsonify({'message': 'Artist not found'}), 404

@artist_route.route('artist/latest', methods=['GET'])
def calculate_top100_artists_followers_popularity_difference_route():
    difference_data = get_todays_artists()
    return jsonify(difference_data)