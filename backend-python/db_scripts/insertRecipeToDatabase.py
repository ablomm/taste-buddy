import pandas as pd
import numpy as np
import re
from sqlalchemy import create_engine

# database connection
engine = create_engine('mysql+mysqlconnector://root:strongPassword@localhost:3306/tastebuddy')
conn = engine.connect()

# retrieving data from dataset
parquet_path = 'recipes.parquet'
recipes_full = pd.read_parquet(parquet_path)

# removing rows without images
recipes_full = recipes_full[recipes_full['Images'].apply(lambda x: x is not None and len(x) > 0)]

# get first 1000 recipes to insert
rows_to_insert = recipes_full.head(1000)[['RecipeId', 'Name', 'TotalTime', 'Description','Images','AggregatedRating', 'Calories', 'RecipeServings']].copy()
# only take first image of image array
rows_to_insert['Images'] = rows_to_insert['Images'].apply(lambda x: x[0] if len(x) > 0 else None)
# rename columns to match databse
rows_to_insert.rename(columns={'RecipeId': 'id','Name': 'recipeTitle','Description': 'description','Images': 'recipeImage','AggregatedRating': 'averageRating','Calories': 'calories','RecipeServings': 'servings'}, inplace=True)

# fill in default values for columns that require it
rows_to_insert['authorID'] = 1
rows_to_insert['servings'] = rows_to_insert['servings'].fillna(4)
rows_to_insert['averageRating'] = rows_to_insert['averageRating'].fillna(0)
rows_to_insert['description'] = rows_to_insert['description'].fillna("")

# function to parse the cook time
def parse_time(time_str):
    hours = re.search(r'(\d+)H', time_str)
    minutes = re.search(r'(\d+)M', time_str)
    hours = int(hours.group(1)) if hours else 0
    minutes = int(minutes.group(1)) if minutes else 0
    return hours, minutes

# set the cooktime columns with function
rows_to_insert[['cookTimeHours', 'cootTimeMinutes']] = rows_to_insert['TotalTime'].apply(lambda x: pd.Series(parse_time(x)))
# remove old time column 
rows_to_insert.drop(['TotalTime'], axis=1, inplace=True)

# insert rows into database
try:
    rows_to_insert.to_sql('Recipe', con=engine, if_exists='append', index=False)
except Exception as e:
    print(f"An error occurred: {e}")
            
# get first 1000 recipes
ingredients_df = recipes_full.head(1000)[['RecipeId', 'RecipeIngredientQuantities','RecipeIngredientParts']].copy()
# rename columns
ingredients_df.rename(columns={'RecipeId': 'recipeID','RecipeIngredientQuantities': 'amount','RecipeIngredientParts': 'ingredient'}, inplace=True)

# separate out the arrays of ingredients and quantities to be on individual lines
rows = []
for _, row in ingredients_df.iterrows():
    recipe_id = row['recipeID']
    for ingredient, amount in zip(row['ingredient'], row['amount']):
        rows.append({'recipeID': recipe_id, 'ingredient': ingredient, 'amount': amount})

# set type to datagframe 
ingredients_to_insert = pd.DataFrame(rows)
# set default values and ensure numeric for amount
ingredients_to_insert['measurementType']= ""
ingredients_to_insert['amount'] = pd.to_numeric(ingredients_to_insert['amount'], errors='coerce').fillna(0)

# insert to database
try:
    ingredients_to_insert.to_sql('RecipeIngredients', con=engine, if_exists='append', index=False)
except Exception as e:
    print(f"An error occurred: {e}")
    
# close connection
conn.close()