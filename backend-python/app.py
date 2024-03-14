import top_rated
import json
import pandas as pd
import sys
from flask import Flask, request, jsonify

app = Flask(__name__)

def train_model():
    top_rated.train()
    return

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

if __name__ == '__main__':
    app.run(debug=True)
