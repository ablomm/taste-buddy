import pandas as pd
import numpy as np
import top_rated
import json
import sys
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
    # get recipe IDs
    saved_recipe_ids = [d['recipeID'] for d in data.get('savedRecipeIDs', [])]
    rejected_recipe_ids = [d['recipeID'] for d in data.get('rejectedRecipeIDs', [])]

    user_saved_recipes = recipes_full[recipes_full['RecipeId'].isin(saved_recipe_ids)]
    user_rejected_recipes = recipes_full[recipes_full['RecipeId'].isin(rejected_recipe_ids)]
    # result = user_saved_recipes["RecipeId", "Name", "CookTime", "Description", "Images", "RecipeCategory", "Keywords", "RecipeIngredientQuantities", "RecipeIngredientParts", "AggregatedRating", "Calories", "RecipeServings", "RecipeInstructions"]
    result = user_saved_recipes
    return result.to_json(orient='records')

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
