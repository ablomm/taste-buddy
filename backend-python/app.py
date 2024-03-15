import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
parquet_path = 'recipes.parquet'
recipes_full = pd.read_parquet(parquet_path)

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
    # top rated recipe model ? 
    result = "top rated recipes" + str(data)
    return result

@app.route('/api/personalized-recommendations', methods=['POST'])
def call_personalized():
    data = request.json
    result = personalized_recommendations(data)
    return jsonify(result)

@app.route('/api/top-rated-recipes', methods=['POST'])
def call_top_rated():
    data = request.json
    result = top_rated_recommendations(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
