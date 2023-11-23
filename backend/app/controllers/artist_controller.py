from flask_pymongo import PyMongo
from app import app
from flask import jsonify, request
from bson import ObjectId

mongo = PyMongo(app)

def get_all_artists():
    artists_collection = mongo.db.artists
    artists_data = list(artists_collection.find({}, {'_id': 0}))
    return {"artists": artists_data}

def get_artist_by_id(artist_id):
    artists_collection = mongo.db.artists
    artist_data = artists_collection.find_one({'_id': ObjectId(artist_id)}, {'_id': 0})
    return artist_data

# Menghitung selisih popularity dan followers berdasarkan id
def calculate_followers_popularity_difference(artist_id):
    artists_collection = mongo.db.artists
    artist_data = artists_collection.find_one({'_id': ObjectId(artist_id)}, {'_id': 0, 'followers_popularity': 1})

    if 'followers_popularity' in artist_data:
        followers_popularity_list = artist_data['followers_popularity']

        # Sort the list by timestamp in ascending order
        followers_popularity_list.sort(key=lambda x: x['timestamp'])

        # Calculate the difference in followers and popularity based on timestamps
        difference_list = []
        for i in range(1, len(followers_popularity_list)):
            diff_followers = followers_popularity_list[i]['followers'] - followers_popularity_list[i - 1]['followers']
            diff_popularity = followers_popularity_list[i]['popularity'] - followers_popularity_list[i - 1]['popularity']

            difference_list.append({
                'timestamp': followers_popularity_list[i]['timestamp'],
                'followers_difference': diff_followers,
                'popularity_difference': diff_popularity
            })

        return {'followers_popularity_difference': difference_list}
    else:
        return {'message': 'Artist not found or no followers_popularity data available'}

# Menghitung dan menampilkan semua selisih popularity dan followers
def calculate_all_artists_followers_popularity_difference():
    artists_collection = mongo.db.artists
    all_artists_data = list(artists_collection.find({}, {'_id': 1, 'followers_popularity': 1}))

    difference_list = []

    for artist_data in all_artists_data:
        artist_id = str(artist_data['_id'])
        followers_popularity_list = artist_data.get('followers_popularity', [])

        # Sort the list by timestamp in ascending order
        followers_popularity_list.sort(key=lambda x: x['timestamp'])

        # Calculate the difference in followers and popularity based on timestamps
        for i in range(1, len(followers_popularity_list)):
            diff_followers = followers_popularity_list[i]['followers'] - followers_popularity_list[i - 1]['followers']
            diff_popularity = followers_popularity_list[i]['popularity'] - followers_popularity_list[i - 1]['popularity']

            difference_list.append({
                "id": artist_id,
                "followers_difference": diff_followers,
                "popularity_difference": diff_popularity,
            })

    return difference_list

# Menghitung dan menampilkan semua selisih popularity followers
def calculate_all_artists_followers_difference():
    artists_collection = mongo.db.artists
    all_artists_data = list(artists_collection.find({}, {'_id': 1, 'followers_popularity': 1}))

    difference_list = []

    for artist_data in all_artists_data:
        artist_id = str(artist_data['_id'])
        followers_popularity_list = artist_data.get('followers_popularity', [])

        # Sort the list by timestamp in ascending order
        followers_popularity_list.sort(key=lambda x: x['timestamp'])

        # Calculate the difference in followers based on timestamps
        for i in range(1, len(followers_popularity_list)):
            diff_followers = followers_popularity_list[i]['followers'] - followers_popularity_list[i - 1]['followers']

            difference_list.append({
                artist_id: {
                    "followers_difference": diff_followers,
                }
            })

    return difference_list

# Menghitung dan menampilkan semua selisih popularity artist
def calculate_all_artists_popularity_difference():
    artists_collection = mongo.db.artists
    all_artists_data = list(artists_collection.find({}, {'_id': 1, 'followers_popularity': 1}))

    difference_list = []

    for artist_data in all_artists_data:
        artist_id = str(artist_data['_id'])
        followers_popularity_list = artist_data.get('followers_popularity', [])

        # Sort the list by timestamp in ascending order
        followers_popularity_list.sort(key=lambda x: x['timestamp'])

        # Calculate the difference in popularity based on timestamps
        for i in range(1, len(followers_popularity_list)):
            diff_popularity = followers_popularity_list[i]['popularity'] - followers_popularity_list[i - 1]['popularity']

            difference_list.append({
                artist_id: {
                    "popularity_difference": diff_popularity,
                }
            })

    return difference_list