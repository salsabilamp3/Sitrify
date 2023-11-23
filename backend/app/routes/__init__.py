from flask import Blueprint

auth_route = Blueprint('auth_route', __name__, url_prefix='/api')
user_route = Blueprint('user_route', __name__, url_prefix='/api')
artist_route = Blueprint('artist_route', __name__, url_prefix='/api')
charts_route = Blueprint('charts_route', __name__, url_prefix='/api')
songs_route = Blueprint('songs_route', __name__, url_prefix='/api')

from . import auth_route, user_route, artist_route, charts_route, songs_route