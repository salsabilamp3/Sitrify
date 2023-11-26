from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_pymongo import PyMongo
import json
from app import app
from app.routes.auth_route import auth_route
from app.routes.user_route import user_route
from app.routes.artist_route import artist_route
from app.routes.charts_route import charts_route
from flask_cors import CORS
from app.routes.songs_route import songs_route
from app.controllers.scheduler_controller import retrieveTop50Global, saveCharts, retrieveArtistInfo

def task_scheduler():
    top50Global = retrieveTop50Global()
    saveCharts(top50Global)
    retrieveArtistInfo()
    print('Scheduler berjalan')

scheduler = BackgroundScheduler()
scheduler.add_job(func=task_scheduler, trigger="cron", hour=9 , minute=0)
scheduler.start()

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/SitrifyDB'
mongo = PyMongo(app)
CORS(app)

app.register_blueprint(auth_route, url_prefix='/api')
app.register_blueprint(user_route, url_prefix='/api')
app.register_blueprint(artist_route, url_prefix='/api')
app.register_blueprint(charts_route, url_prefix='/api')

def main():
    # data = {
    #     "acousticness": 0.256,
    #     "danceability": 0.75,
    #     "energy": 0.733,
    #     "speechiness": 0.0319,
    #     "instrumentalness": 0,
    #     "liveness": 0.114,
    #     "loudness": -3.18,
    #     "valence": 0.844
    # }
    # predict_song(data)

    charts = retrieveTop50Global()
    saveCharts(charts)


if __name__ == '__main__':
    app.run(debug=True)
    # main()