# Creating the dataloader (necessary for PyTorch)
from torch.utils.data.dataset import Dataset
from torch.utils.data import DataLoader
from torch import save 
import torch 
import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

class Loader():
    
    def __init__(self,smallSet):

        recipes = pd.read_parquet('data/dataset/recipes.parquet')
        reviews = pd.read_parquet('data/dataset/reviews.parquet')

        if smallSet: 
            db = os.getenv("DB_CONNECTION_STRING")
            engine = create_engine(db)
            conn = engine.connect()
            recipes_raw = pd.read_sql('SELECT * FROM Recipe LIMIT 4000;', engine)
            reviews_raw = pd.read_sql('SELECT * FROM review LIMIT 4000;', engine)

            recipes = recipes_raw.rename(columns={'authorID': 'AuthorId', 'recipeTitle': 'Name', 'id': 'RecipeId'}) 
            reviews = reviews_raw.rename(columns={'userID': 'AuthorId','rating':'Rating','recipeID': 'RecipeId'}) 

        self.reviews = reviews.copy()

        users = reviews.AuthorId.unique()
        recipes = reviews.RecipeId.unique()

        self.userid2idx = {o:i for i,o in enumerate(users)}
        self.RecipeId2idx = {o:i for i,o in enumerate(recipes)}

        self.idx2userid = {i:o for o,i in self.userid2idx.items()}
        self.idx2RecipeId = {i:o for o,i in self.RecipeId2idx.items()}

        self.reviews.RecipeId = reviews.RecipeId.apply(lambda x: self.RecipeId2idx[x])
        self.reviews.AuthorId = reviews.AuthorId.apply(lambda x: self.userid2idx[x])

        self.x = self.reviews[['AuthorId', 'RecipeId']].values  # Input features
        self.y = self.reviews['Rating'].values  # Target variables

        #print(self.x)
        #print(self.y)
        self.x, self.y = torch.tensor(self.x), torch.tensor(self.y) # Transforms the data to tensors

    def __getitem__(self, index):
        return (self.x[index], self.y[index])

    def __len__(self):
        return len(self.reviews)