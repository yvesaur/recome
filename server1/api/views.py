import requests
import psycopg2
from rest_framework.response import Response
from rest_framework.decorators import api_view

import numpy as np  # linear algebra
import pandas as pd  # data processing, CSV file I/O (e.g. pd.read_csv)
import torch.nn as nn
import pytorch_lightning as pl
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import torch
from collections import Counter
import csv
import os
os.environ['CRYPTOGRAPHY_OPENSSL_NO_LEGACY'] = '1'


# Constants for database connection
DB_NAME = "recome"
USERNAME = "postgres"
PASSWORD = "postgres"
HOST = "localhost"
PORT = "5432"

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=USERNAME,
    password=PASSWORD,
    host=HOST,
    port=PORT
)

raw_behaviour = pd.read_csv("./api/behaviours.tsv", sep="\t", names=[
    "impressionId", "userId", "timestamp", "click_history", "impressions"])
print(
    f"The dataset originally consists of {len(raw_behaviour)} number of interactions.")
# raw_behaviour.head(1)

news = pd.read_csv("./api/news.tsv", sep="\t", names=[
                   "itemId", "category", "subcategory", "title", "abstract", "url", "title_entities", "abstract_entities"])
print(f"The news data consist in total of {len(news)} number of news.")
# news.head(1)

# Function to split the impressions and clicks into two seperate lists


def process_impression(impression_list):
    list_of_strings = impression_list.split()
    click = [x.split('-')[0]
             for x in list_of_strings if x.split('-')[1] == '1']
    non_click = [x.split('-')[0]
                 for x in list_of_strings if x.split('-')[1] == '0']
    return click, non_click


# We can then indexize these two new columns:
raw_behaviour['click'], raw_behaviour['noclicks'] = zip(
    *raw_behaviour['impressions'].map(process_impression))

# Convert timestamp value to hours since epoch
raw_behaviour['epochhrs'] = pd.to_datetime(
    raw_behaviour['timestamp']).values.astype(np.int64)/(1e6)/1000/3600
raw_behaviour['epochhrs'] = raw_behaviour['epochhrs'].round()

# If there exists several clicks in one session, expand to new observation
raw_behaviour = raw_behaviour.explode("click").reset_index(drop=True)

# Extract the clicks from the previous clicks
click_history = raw_behaviour[[
    "userId", "click_history"]].drop_duplicates().dropna()
click_history["click_history"] = click_history.click_history.map(
    lambda x: x.split())
click_history = click_history.explode("click_history").rename(
    columns={"click_history": "click"})

# Dummy time set to earlies epochhrs in raw_behaviour as we don't know when these events took place.
click_history["epochhrs"] = raw_behaviour.epochhrs.min()
click_history["noclicks"] = pd.Series(
    [[] for _ in range(len(click_history.index))])

# concatenate historical clicks with the raw_behaviour
raw_behaviour = pd.concat(
    [raw_behaviour, click_history], axis=0).reset_index(drop=True)
print(
    f"The dataset after pre-processing consist of {len(raw_behaviour)} number of interactions.")

min_click_cutoff = 100
print(f'Number of items that have less than {min_click_cutoff} clicks make up', np.round(np.mean(
    raw_behaviour.groupby("click").size() < min_click_cutoff)*100, 3), '% of the total, and these will be removed.')

# remove items with less clicks than min_click_cutoff
raw_behaviour = raw_behaviour[raw_behaviour.groupby("click")["userId"].transform(
    'size') >= min_click_cutoff].reset_index(drop=True)
# Get a set with all the unique items
click_set = set(raw_behaviour['click'].unique())

# remove items for impressions that is not avaiable in the click set (the items that we will be training on)
raw_behaviour['noclicks'] = raw_behaviour['noclicks'].apply(lambda impressions: [
                                                            impression for impression in impressions if impression in click_set])

# Select the columns that we now want to use for further analysis
behaviour = raw_behaviour[['epochhrs', 'userId', 'click', 'noclicks']].copy()

print('Number of interactions in the behaviour dataset:', behaviour.shape[0])
print('Number of users in the behaviour dataset:', behaviour.userId.nunique())
print('Number of articles in the behaviour dataset:', behaviour.click.nunique())

# behaviour.head()

# Let us use the last 10pct of the data as our validation data:
test_time_th = behaviour['epochhrs'].quantile(0.9)
train = behaviour[behaviour['epochhrs'] < test_time_th].copy()

# Indexize items
# Allocate a unique index for each item, but let the zeroth index be a UNK index:
ind2item = {idx + 1: itemid for idx, itemid in enumerate(train.click.unique())}
item2ind = {itemid: idx for idx, itemid in ind2item.items()}

train['noclicks'] = train['noclicks'].map(
    lambda list_of_items: [item2ind.get(l, 0) for l in list_of_items])
train['click'] = train['click'].map(lambda item: item2ind.get(item, 0))

# Indexize users
# Allocate a unique index for each user, but let the zeroth index be a UNK index:
ind2user = {idx + 1: userid for idx,
            userid in enumerate(train['userId'].unique())}
user2ind = {userid: idx for idx, userid in ind2user.items()}

# Create a new column with userIdx:
train['userIdx'] = train['userId'].map(lambda x: user2ind.get(x, 0))

# Repeat for validation
valid = behaviour[behaviour['epochhrs'] >= test_time_th].copy()
valid["click"] = valid["click"].map(lambda item: item2ind.get(item, 0))
valid["noclicks"] = valid["noclicks"].map(
    lambda list_of_items: [item2ind.get(l, 0) for l in list_of_items])
valid["userIdx"] = valid["userId"].map(lambda x: user2ind.get(x, 0))
# valid


class MindDataset(Dataset):
    # A fairly simple torch dataset module that can take a pandas dataframe (as above),
    # and convert the relevant fields into a dictionary of arrays that can be used in a dataloader
    def __init__(self, df):
        # Create a dictionary of tensors out of the dataframe
        self.data = {
            'userIdx': torch.tensor(df.userIdx.values.astype(np.int64)),
            'click': torch.tensor(df.click.values.astype(np.int64))
        }

    def __len__(self):
        return len(self.data['userIdx'])

    def __getitem__(self, idx):
        return {key: val[idx] for key, val in self.data.items()}


# Build datasets and dataloaders of train and validation dataframes:
bs = 1024
ds_train = MindDataset(train)
train_loader = DataLoader(ds_train, batch_size=bs, shuffle=True)
ds_valid = MindDataset(valid)
valid_loader = DataLoader(ds_valid, batch_size=bs, shuffle=False)

batch = next(iter(train_loader))

# Build a matrix factorization model


class NewsMF(pl.LightningModule):
    def __init__(self, num_users, num_items, dim=10):
        super().__init__()
        self.dim = dim
        self.num_users = num_users
        self.num_items = num_items

        self.useremb = nn.Embedding(
            num_embeddings=num_users, embedding_dim=dim)
        self.itememb = nn.Embedding(
            num_embeddings=num_items, embedding_dim=dim)

    def step(self, batch, batch_idx, phase="train"):
        batch_size = batch['userIdx'].size(0)
        uservec = self.useremb(batch['userIdx'])
        itemvec_click = self.itememb(batch['click'])

        # For each positive interaction,sample a random negative
        neg_sample = torch.randint_like(batch["click"], 1, self.num_items)
        itemvec_noclick = self.itememb(neg_sample)

        score_click = torch.sigmoid(
            (uservec*itemvec_click).sum(-1).unsqueeze(-1))
        score_noclick = torch.sigmoid(
            (uservec*itemvec_noclick).sum(-1).unsqueeze(-1))

        # Compute loss as binary cross entropy (categorical distribution between the clicked and the no clicked item)
        scores_all = torch.concat((score_click, score_noclick), dim=1)
        target_all = torch.concat(
            (torch.ones_like(score_click), torch.zeros_like(score_noclick)), dim=1)
        loss = F.binary_cross_entropy(scores_all, target_all)
        return loss

    def training_step(self, batch, batch_idx):
        return self.step(batch, batch_idx, "train")

    def validation_step(self, batch, batch_idx):
        # for now, just do the same computation as during training
        return self.step(batch, batch_idx, "val")

    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
        return optimizer

# Define and train model
# mf_model = NewsMF(num_users=len(ind2user) + 1, num_items = len(ind2item) + 1, dim = 50)
# trainer = pl.Trainer(max_epochs=50, accelerator="gpu")
# trainer.fit(model=mf_model, train_dataloaders=train_loader)

# Save the model
# trainer.save_checkpoint("model_news.ckpt")


# Load the trained model
mf_model = NewsMF.load_from_checkpoint(
    checkpoint_path="./api/model_news.ckpt", num_users=len(ind2user) + 1, num_items=len(ind2item) + 1, dim=50)

# Add more information to the article data
# The item index
news["ind"] = news["itemId"].map(item2ind)
news = news.sort_values("ind").reset_index(drop=True)
# Number of clicks in training data per article, investigate the cold start issue
news["n_click_training"] = news["ind"].map(dict(Counter(train.click)))
# 5 most clicked articles
# news.sort_values("n_click_training", ascending=False).head()

# store the learned item embedding into a seperate tensor
itememb = mf_model.itememb.weight.detach()
print(itememb.shape)

# Investigate different rows of the item embedding (articles embeddings) to see if the model works
# some examples N13259, N16636, N10272
# Can you find some examples that does not work good? Why?


def fetch_rows_from_table(file_name, table_name, limit=3):

    # Create a cursor object using the connection
    cur = conn.cursor()

    # Define your SQL query with a LIMIT to fetch the specified number of rows
    query = f"SELECT * FROM {table_name} LIMIT {limit}"

    # Execute the query
    cur.execute(query)

    # Fetch the results
    rows = cur.fetchall()

    # Open the file in write mode
    with open(file_name, 'w', newline='') as f:
        writer = csv.writer(f, delimiter='\t')

        # Write the rows
        writer.writerows(rows)

    # Close the cursor and connection
    cur.close()
    # conn.close()

    return rows


@api_view(['GET'])
def getRecommendedNews(request, id):
    # news = fetch_rows_from_table("./api/news.tsv", "news", limit=3)\
    ind = item2ind.get(id)
    if not ind:
        recoNews = news.sort_values(
            "n_click_training", ascending=True).head(20)
        return Response(recoNews['itemId'])
    else:
        # This calculates the cosine similarity and outputs the 10 most similar articles w.r.t to ind in descending order
        similarity = torch.nn.functional.cosine_similarity(
            itememb[ind], itememb, dim=0)
        most_sim = news[~news.ind.isna()].iloc[(
            similarity.argsort(descending=True).numpy()-1)]

        return Response(most_sim['itemId'].head(20))

    # return Response(most_sim['itemId'].head(8))


@api_view(['GET'])
def getTrendingNews(request):
    # behaviours = fetch_rows_from_table(
    #    "./api/behaviours.tsv", "behaviours", limit=3)

    # news = fetch_rows_from_table("./api/news.tsv", "news", limit=3)\

    return Response(news.sort_values("n_click_training", ascending=False).head(20))
