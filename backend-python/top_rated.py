import zipfile
import pandas as pd
import torch
import os
import boto3
import warnings
import numpy as np
from Loader import Loader
from MatrixFactorization import MatrixFactorization
from torch.utils.data.dataset import Dataset
from torch.utils.data import DataLoader
from torch import save 
from tqdm.notebook import tqdm
from sklearn.cluster import KMeans
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

s3 = boto3.client('s3',  
                  aws_access_key_id= os.getenv("AWS_ACCESS_KEY_ID"),
                  aws_secret_access_key= os.getenv("AWS_SECRET_ACCESS_KEY"), 
                  region_name='us-east-2')

bucket_name = 'tastebuddy-images'
folder_name = 'engine/'

engine = create_engine('mysql+mysqlconnector://root:0000@localhost:3306/tastebuddy')
conn = engine.connect()

def get_zip():
    object_key = folder_name + "dataset.zip"
    file_path = "dataset.zip"

    try:
        s3.download_file(bucket_name, object_key, file_path)

        if os.path.isfile("dataset.zip"):
            print('dataset downloaded')

        return True
    except Exception as e:
        print('dataset unable to download')
        print(e)
        return False 

def setup():
    
    if (not os.path.isfile("dataset.zip")):
       get_zip()

    if os.path.isdir("data"):
       return True
    else:
        try: 
           with zipfile.ZipFile('dataset.zip', 'r') as zip_ref:
            zip_ref.extractall('data')

            print('extracted dataset.zip')
        except Exception as e:
            print('unable to extract dataset.zip')
            print(e)
            return False

def train(smallSet):

    if not os.path.isdir("data"): #check for extracted data
       setup()
    
    recipes_path = 'data/dataset/recipes.parquet'
    recipes = pd.read_parquet(recipes_path)
    recipes = recipes[recipes['Images'].apply(lambda x: x is not None and len(x) > 0)]
    #smallSet = True
    review_path = 'data/dataset/reviews.parquet'
    reviews = pd.read_parquet(review_path)

    if smallSet:
        recipes_raw = pd.read_sql('SELECT * FROM recipe LIMIT 1000;', engine)
        reviews_raw = pd.read_sql('SELECT * FROM review LIMIT 1000;', engine)

        recipes = recipes_raw.rename(columns={'authorID': 'AuthorId', 'recipeTitle': 'Name', 'id': 'RecipeId'}) 
        reviews = reviews_raw.rename(columns={'userID': 'AuthorId','rating':'Rating','recipeID': 'RecipeId'}) 

    print('Size of the recipes: ', recipes.shape, '\nSize of the Reviews: ', reviews.shape)

    n_users = len(reviews.AuthorId.unique())
    n_items = len(reviews.RecipeId.unique())

    print(len(recipes) / (n_users*n_items) * 100, '% of the matrix is filled.')

    num_epochs = 128
    cuda = torch.cuda.is_available()

    print("Is running on GPU:", cuda)

    model = MatrixFactorization(n_users, n_items, n_factors=8)
    print(model)
    for name, param in model.named_parameters():
        if param.requires_grad:
            print(name, param.data)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    loss_fn = torch.nn.MSELoss()   # MSE loss
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    # Train data
    train_set = Loader(smallSet)
    train_loader = DataLoader(train_set, 128, shuffle=True)

    for it in tqdm(range(num_epochs)):
        losses = []
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            outputs = model(x)
            loss = loss_fn(outputs.squeeze(), y.type(torch.float32))
            print('loss ', loss)
            losses.append(loss.item())
            loss.backward()
            optimizer.step()
        if len(losses) == 0:
            raise ValueError("No losses recorded. Check DataLoader and training loop.")

        print("iter #{}".format(it), "Loss:", sum(losses) / len(losses))

    model.to('cpu')  # Move model to CPU before saving just in case
    if smallSet:
        torch.save(model.state_dict(), 'model_state_small_dict.pth')
    else:
        torch.save(model.state_dict(), 'model_state_dict.pth')
    print("Model state dictionary saved successfully.")

    return

def convert_to_list(data):
    if isinstance(data, np.ndarray):
        return data.tolist()
    return data  # Return as is if not an ndarray

def top100(smallSet):
    recipes_path = 'data/dataset/recipes.parquet'
    recipes = pd.read_parquet(recipes_path)
    recipes = recipes[recipes['Images'].apply(lambda x: x is not None and len(x) > 0)]
    recipes['Images'] = recipes['Images'].apply(convert_to_list)
    recipes['RecipeInstructions'] = recipes['RecipeInstructions'].apply(convert_to_list)

    review_path = 'data/dataset/reviews.parquet'
    reviews = pd.read_parquet(review_path)
    #smallSet = True
    if smallSet:
        recipes_raw = pd.read_sql('SELECT * FROM recipe LIMIT 1000;', engine)
        reviews_raw = pd.read_sql('SELECT * FROM review LIMIT 1000;', engine)

        recipes = recipes_raw.rename(columns={'authorID': 'AuthorId', 'recipeTitle': 'Name', 'id': 'RecipeId'}) 
        reviews = reviews_raw.rename(columns={'userID': 'AuthorId','rating':'Rating','recipeID': 'RecipeId'}) 

    recipe_names = recipes.set_index('RecipeId')['Name'].to_dict()
    n_users = len(reviews.AuthorId.unique())
    n_items = len(reviews.RecipeId.unique())

    loaded_model = MatrixFactorization(n_users, n_items, n_factors=8)

    if smallSet:
        loaded_model.load_state_dict(torch.load('model_state_small_dict.pth'))
    else:
        loaded_model.load_state_dict(torch.load('model_state_dict.pth'))

    
    loaded_model.eval()

    train_set = Loader(smallSet)

    if torch.cuda.is_available():
        loaded_model.cuda()


    trained_recipe_embeddings = loaded_model.item_factors.weight.data.cpu().numpy()
    len(trained_recipe_embeddings) 

    kmeans = KMeans(n_clusters=10, random_state=0).fit(trained_recipe_embeddings) #fit to kmeans

    warnings.filterwarnings('ignore')

    clustered_recipes_list = []

    for cluster in range(10):
        print("Cluster #{}".format(cluster))
        recs = []

        cluster_indexes = np.where(kmeans.labels_ == cluster)[0]
        cluster_recipe_ids = []
        cluster_df = recipes[recipes['RecipeId'].isin(cluster_recipe_ids)]
        cluster_df['Cluster'] = cluster
        clustered_recipes_list.append(cluster_df)

        for recidx in cluster_indexes:
            recid = train_set.idx2RecipeId[recidx]
            cluster_recipe_ids.append(recid)
            recipe_row = recipes[recipes['RecipeId'] == recid]
            recipe_row['Cluster'] = cluster
            #clustered_recipes = clustered_recipes.append(recipe_row)

            #print(recipes)
            rat_count = reviews.loc[reviews['RecipeId']==recid].count()[0]
            if recid in recipe_names:
                recs.append((recipe_names[recid], rat_count))
            else:
                print(f"Recipe ID {recid} not found in recipes.")
            if len(recs) == 10:
                break
        for rec in sorted(recs, key=lambda tup: tup[1], reverse=True)[:10]:
            print("\t", rec[0])
        
        cluster_df = recipes[recipes['RecipeId'].isin(cluster_recipe_ids)]
        cluster_df['Cluster'] = cluster
        clustered_recipes_list.append(cluster_df)
    
    return clustered_recipes_list