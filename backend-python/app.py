import pandas as pd
import numpy as np
import top_rated
import json
import sys
import os
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine
from dotenv import load_dotenv

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
    
load_dotenv()
    
# Create mysql database connection
db = os.getenv("DB_CONNECTION_STRING")
engine = create_engine(db)
conn = engine.connect()

# Get data from database
sql = """
SELECT rt.A AS recipeID,
GROUP_CONCAT(t.Name) AS tags
FROM tastebuddy._RecipeTags rt
JOIN tastebuddy.Tag t ON rt.B = t.id
GROUP BY rt.A
"""
recipes = pd.read_sql(sql, conn)

# Close connection
conn.close()

def personalized_recommendations(data):
   # Get recipe IDs from dataset with passed data 
    saved_recipe_ids = [d['recipeID'] for d in data.get('savedRecipeIDs', [])]
    rejected_recipe_ids = [d['recipeID'] for d in data.get('rejectedRecipeIDs', [])]
    exclude_ids = set(saved_recipe_ids).union(rejected_recipe_ids)
    # filtered out ids -- database
    filtered_recipes_db = recipes[~recipes['recipeID'].isin(exclude_ids)]

    # Get saved recipes from ids -- database
    user_saved_recipes = recipes[recipes['recipeID'].isin(saved_recipe_ids)]
    # user_rejected_recipes = recipes[recipes['recipeID'].isin(rejected_recipe_ids)]

    # Select desired features for training
    user_saved_tags = user_saved_recipes["tags"]

    # train on feature to find most similar
    vectorizer_tags = TfidfVectorizer()
    tfidf_matrix_tags = vectorizer_tags.fit_transform(filtered_recipes_db["tags"].astype(str))
    tfidf_matrix_user_saved_tags = vectorizer_tags.transform(user_saved_tags.astype(str))
    similarity_scores_tags = cosine_similarity(tfidf_matrix_user_saved_tags, tfidf_matrix_tags)

    # Store all recommended recipe IDs here
    all_recommended_ids = set()
    average_similarity = np.mean(similarity_scores_tags, axis=0)
    top_recommended = np.argsort(average_similarity)[-20:][::-1]
    top_recipe_ids = filtered_recipes_db.iloc[top_recommended]['recipeID'].values

    all_recommended_ids = set(map(int, top_recipe_ids))

    result = list(all_recommended_ids)
    return json.dumps(result)

def top_rated_recommendations(smallSet):
    # top rated recipe model 
    result = top_rated.top100(smallSet)

    all_recipes_list = []

    if smallSet:
        all_recipes_list = result
    else:
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
    smallSet = True
    result = []

    if smallSet:
        result = top_rated_recommendations(smallSet)
    else:
        result = np.array(top_rated_recommendations(smallSet)).tolist()

    return jsonify(result)

@app.route('/api/train/top-rated-recipes', methods=['POST'])
def train_top_rated_endpoint():
    data = request.json
    result = train_top_rated(data)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
