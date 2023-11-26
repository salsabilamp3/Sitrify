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
# CORS(app)

app.register_blueprint(auth_route, url_prefix='/api')
app.register_blueprint(user_route, url_prefix='/api')
app.register_blueprint(artist_route, url_prefix='/api')
app.register_blueprint(charts_route, url_prefix='/api')
app.register_blueprint(songs_route, url_prefix='/api')

if __name__ == '__main__':
    app.run()