import pandas as pd
import numpy as np
import os
import time    
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

db = os.getenv("DB_CONNECTION_STRING")
print(db)
engine = create_engine(db)
conn = engine.connect()
sql = "SELECT * FROM tastebuddy.review"

df = pd.read_parquet('../data/dataset/reviews.parquet')

transformed_df = df.head(10000)[['RecipeId','Review','Rating','AuthorId','AuthorName','DateSubmitted']].copy()

transformed_df['profilePic'] = ''
transformed_df['DateSubmitted'] = pd.to_datetime(df['DateSubmitted'])

print(df)

transformed_df.rename(columns={
    'RecipeId': 'recipeID',
    'Review': 'reviewText',
    'Rating': 'rating',
    'AuthorId': 'userID',
    'AuthorName': 'username',
    'profilePic': 'profilePic',
    'DateSubmitted': 'timePosted',
    }, inplace=True)

try:
    transformed_df.to_sql('review', con=engine, if_exists='append', index=False)
except Exception as e:
    print(f"An error occurred: {e}")

conn.close()