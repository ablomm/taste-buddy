import top_rated
import json
import pandas as pd
import sys
from flask import Flask, request, jsonify

app = Flask(__name__)

def train_top_rated():
    top_rated.train()
    return "Training completed."

def extract_top_rated(data):
    set = top_rated.setup()

    if set:
        return "Dataset extracted successfully"
    else:
        return "Dataset failed to extract"

def personalized_recommendations(data):
    # insert part to get personalized recipes
    result = "personalized recs with data " + str(data)
    return result

def top_rated_recommendations(data):
    # top rated recipe model 
    result = top_rated.top100()

    all_recipes_list = []

    #convert dataframes within list to a list of dictionaries
    for df in result:
        if isinstance(df, pd.DataFrame) and not df.empty:
            all_recipes_list.extend(df.to_dict(orient="records"))
            
    return json.dumps(all_recipes_list)

@app.route('/api/personalized-recommendations', methods=['POST'])
def call_personalized():
    data = request.json
    result = personalized_recommendations(data)
    return jsonify(result)

@app.route('/api/top-rated-recipes', methods=['POST'])
def call_top_rated():
    data = request.json
    result = top_rated_recommendations(data)
    return result

@app.route('/api/top-rated/setup', methods=['POST'])
def setup_top_rated():
    data = request.json
    result = extract_top_rated(data)
    return jsonify(result)

@app.route('/api/top-rated/train', methods=['POST'])
def train_top_rated():
    data = request.json
    result = train_top_rated()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
