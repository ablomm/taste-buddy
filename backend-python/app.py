import pandas as pd
import numpy as np
import top_rated
import json
import sys
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

def train_top_rated(data):
    top_rated.train(data)
    return "Training completed."

def extract_top_rated(data):
    set = top_rated.setup()

    if set:
        return "Dataset extracted successfully"
    else:
        return "Dataset failed to extract"
    
def personalized_recommendations(data):
    recipes_path = 'data/dataset/recipes.parquet'
    recipes_full = pd.read_parquet(recipes_path)
    recipes_full = recipes_full[recipes_full['Images'].apply(lambda x: x is not None and len(x) > 0)]

    # Get recipe IDs
    saved_recipe_ids = [d['recipeID'] for d in data.get('savedRecipeIDs', [])]
    rejected_recipe_ids = [d['recipeID'] for d in data.get('rejectedRecipeIDs', [])]
    
    # Get recipes from recipe IDs
    user_saved_recipes = recipes_full[recipes_full['RecipeId'].isin(saved_recipe_ids)]
    user_rejected_recipes = recipes_full[recipes_full['RecipeId'].isin(rejected_recipe_ids)]
    
    # Select desired features for training
    user_saved_keywords = user_saved_recipes["Keywords"]
    user_saved_category = user_saved_recipes["RecipeCategory"]
    user_saved_ingredients = recipes_full["RecipeIngredientParts"]
    
    # For Recipe Keywords
    vectorizer_keywords = TfidfVectorizer()
    tfidf_matrix_keywords = vectorizer_keywords.fit_transform(recipes_full["Keywords"].astype(str))
    tfidf_matrix_user_saved_keywords = vectorizer_keywords.transform(user_saved_keywords.astype(str))
    similarity_scores_keywords = cosine_similarity(tfidf_matrix_user_saved_keywords, tfidf_matrix_keywords)

    # For Recipe Category
    vectorizer_category = TfidfVectorizer()
    tfidf_matrix_category = vectorizer_category.fit_transform(recipes_full["RecipeCategory"].astype(str))
    tfidf_matrix_user_saved_category = vectorizer_category.transform(user_saved_category.astype(str))
    similarity_scores_category = cosine_similarity(tfidf_matrix_user_saved_category, tfidf_matrix_category)

    # For RecipeIngredients
    # vectorizer_ingredients = TfidfVectorizer()
    # tfidf_matrix_ingredients = vectorizer_ingredients.fit_transform(recipes_full["RecipeIngredientParts"].astype(str))
    # tfidf_matrix_user_saved_ingredients = vectorizer_ingredients.transform(user_saved_ingredients.astype(str))
    # similarity_scores_ingredients = cosine_similarity(tfidf_matrix_user_saved_ingredients, tfidf_matrix_ingredients)

    # Store all recommended recipe IDs here
    all_recommended_ids = set()

    weighted_similarities = (similarity_scores_category + similarity_scores_keywords)/2

    average_similarity = np.mean(weighted_similarities, axis=0)
    top_recommended = np.argsort(average_similarity)[-5:]
    top_recommended = top_recommended[::-1]
    top_recipe_ids = recipes_full.iloc[top_recommended]['RecipeId'].values
    all_recommended_ids = set(top_recipe_ids)

    # Remove any recipes that are already saved/rejected
    final_recommendations = all_recommended_ids.difference(saved_recipe_ids, rejected_recipe_ids)
    

    # result = user_saved_recipes["RecipeId", "Name", "CookTime", "Description", "Images", "RecipeCategory", "Keywords", "RecipeIngredientQuantities", "RecipeIngredientParts", "AggregatedRating", "Calories", "RecipeServings", "RecipeInstructions"]
    result = recipes_full[recipes_full['RecipeId'].isin(final_recommendations)]
    return result.to_json(orient='records')

def top_rated_recommendations(data):
    # top rated recipe model 
    result = top_rated.top100(data)

    all_recipes_list = []

    #convert dataframes within list to a list of dictionaries
    for df in result:
        if isinstance(df, pd.DataFrame) and not df.empty:
            for column in df.columns:
                # Apply conversion if any cell in the column is an ndarray
                if df[column].apply(lambda x: isinstance(x, np.ndarray)).any():
                    df[column] = df[column].apply(lambda x: x.tolist() if isinstance(x, np.ndarray) else x)
            all_recipes_list.extend(df.to_dict(orient="records"))
            
    return all_recipes_list

@app.route('/api/personalized-recommendations', methods=['POST'])
def call_personalized():
    data = request.json
    result = personalized_recommendations(data)
    return jsonify(result)

@app.route('/api/top-rated-recipes', methods=['POST'])
def call_top_rated():
    data = request.json
    result = np.array(top_rated_recommendations(data)).tolist()
    print(result)
    return jsonify(result)

@app.route('/api/train/top-rated-recipes', methods=['POST'])
def train_top_rated_endpoint():
    data = request.json
    result = train_top_rated(data)
    print(result)
    return jsonify(result)

@app.route('/api/extract/top-rated-recipes', methods=['POST'])
def extract_top_rated_files():
    data = request.json
    result = extract_top_rated(data)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
