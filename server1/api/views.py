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
# Create a cursor object
cur = conn.cursor()

# Execute a query for behaviours
cur.execute("SELECT * FROM behaviours")
# Fetch all the rows for news
rows = cur.fetchall()
column_names = [desc[0] for desc in cur.description]  # Get the column names
# Create a DataFrame from the rows, with the column names
raw_behaviour = pd.DataFrame(rows, columns=column_names)

print(
    f"The dataset originally consists of {len(raw_behaviour)} number of interactions.")
# raw_behaviour.head()

# Execute a query for news
cur.execute("SELECT * FROM news1")
# Fetch all the rows for news
rows = cur.fetchall()
column_names = [desc[0] for desc in cur.description]  # Get the column names
# Create a DataFrame from the rows, with the column names
news = pd.DataFrame(rows, columns=column_names)
print(f"The news data consist in total of {len(news)} number of news.")
news.head()

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
    "userid", "click_history"]].drop_duplicates().dropna()
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
raw_behaviour = raw_behaviour[raw_behaviour.groupby("click")["userid"].transform(
    'size') >= min_click_cutoff].reset_index(drop=True)
# Get a set with all the unique items
click_set = set(raw_behaviour['click'].unique())

# remove items for impressions that is not avaiable in the click set (the items that we will be training on)
raw_behaviour['noclicks'] = raw_behaviour['noclicks'].apply(lambda impressions: [
                                                            impression for impression in impressions if impression in click_set])

# Select the columns that we now want to use for further analysis
behaviour = raw_behaviour[['epochhrs', 'userid', 'click', 'noclicks']].copy()

print('Number of interactions in the behaviour dataset:', behaviour.shape[0])
print('Number of users in the behaviour dataset:', behaviour.userid.nunique())
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
            userid in enumerate(train['userid'].unique())}
user2ind = {userid: idx for idx, userid in ind2user.items()}

# Create a new column with userIdx:
train['userIdx'] = train['userid'].map(lambda x: user2ind.get(x, 0))

# Repeat for validation
valid = behaviour[behaviour['epochhrs'] >= test_time_th].copy()
valid["click"] = valid["click"].map(lambda item: item2ind.get(item, 0))
valid["noclicks"] = valid["noclicks"].map(
    lambda list_of_items: [item2ind.get(l, 0) for l in list_of_items])
valid["userIdx"] = valid["userid"].map(lambda x: user2ind.get(x, 0))
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
# mf_model = NewsMF(num_users=len(ind2user) + 1,
#                   num_items=len(ind2item) + 1, dim=50)
# trainer = pl.Trainer(max_epochs=50, accelerator="gpu")
# trainer.fit(model=mf_model, train_dataloaders=train_loader)

# Save the model
# trainer.save_checkpoint("model_news.ckpt")


# Load the trained model
mf_model = NewsMF.load_from_checkpoint(
    checkpoint_path="./api/model_news.ckpt", num_users=len(ind2user) + 1, num_items=len(ind2item) + 1, dim=50)

# Add more information to the article data
# The item index
news["ind"] = news["id"].map(item2ind)
news = news.sort_values("ind").reset_index(drop=True)
# Number of clicks in training data per article, investigate the cold start issue
news["n_click_training"] = news["ind"].map(dict(Counter(train.click)))
# 5 most clicked articles
# news.sort_values("n_click_training",ascending=False).head()

# store the learned item embedding into a seperate tensor
itememb = mf_model.itememb.weight.detach()
print(itememb.shape)

# Investigate different rows of the item embedding (articles embeddings) to see if the model works
# some examples N13259, N16636, N10272
# Can you find some examples that does not work good? Why?

"""
# USERS RECOMENDATION = USER ENCODER #
# Execute a query for behaviours
cur.execute("SELECT * FROM behaviours")
# Fetch all the rows for news
rows = cur.fetchall()
column_names = [desc[0] for desc in cur.description] # Get the column names 
raw_behaviour_users = pd.DataFrame(rows, columns=column_names) # Create a DataFrame from the rows, with the column names


# Indexize users
unique_userIds_user = raw_behaviour_users['userid'].unique()
# Allocate a unique index for each user, but let the zeroth index be a UNK index:
ind2user_user = {idx + 1: itemid for idx,
                 itemid in enumerate(unique_userIds_user)}
user2ind_user = {itemid: idx for idx, itemid in ind2user_user.items()}
print(f"We have {len(user2ind_user)} unique users in the dataset")

# Create a new column with userIdx:
raw_behaviour_users['userIdx'] = raw_behaviour_users['userid'].map(
    lambda x: user2ind_user.get(x, 0))
# raw_behaviour_users.head()

# Indexize click history field


def process_click_history_user(s):
    list_of_strings = str(s).split(" ")
    return [item2ind.get(l, 0) for l in list_of_strings]


raw_behaviour_users['click_history_idx'] = raw_behaviour_users.click_history.map(
    lambda s:  process_click_history_user(s))
# raw_behaviour_users.head()

# collect one click and one no-click from impressions:


# collect one click and one no-click from impressions:
def process_impression_user(s):
    list_of_strings = s.split(" ")
    itemid_rel_tuple = [l.split("-") for l in list_of_strings]
    noclicks = []
    for entry in itemid_rel_tuple:
        # print(entry[1])
        if entry[1] == '0':
            noclicks.append(entry[0])
        if entry[1] == '1':
            click = entry[0]
    return noclicks, click


raw_behaviour_users['noclicks'], raw_behaviour_users['click'] = zip(
    *raw_behaviour_users['impressions'].map(process_impression_user))
# We can then indexize these two new columns:
raw_behaviour_users['noclicks'] = raw_behaviour_users['noclicks'].map(
    lambda list_of_strings: [item2ind.get(l, 0) for l in list_of_strings])
raw_behaviour_users['click'] = raw_behaviour_users['click'].map(
    lambda x: item2ind.get(x, 0))

# raw_behaviour_users.head()

# convert timestamp value to hours since epoch
raw_behaviour_users['epochhrs'] = pd.to_datetime(
    raw_behaviour_users['timestamp']).values.astype(np.int64)/(1e6)/1000/3600
raw_behaviour_users['epochhrs'] = raw_behaviour_users['epochhrs'].round()
raw_behaviour_users[['click', 'epochhrs']].groupby(
    "click").min("epochhrs").reset_index()

raw_behaviour_users['noclick'] = raw_behaviour_users['noclicks'].map(
    lambda x: x[0])
behaviour_user = raw_behaviour_users[[
    'epochhrs', 'userIdx', 'click_history_idx', 'noclick', 'click']]
behaviour_user.head()

# Let us use the last 10pct of the data as our validation data:
test_time_th_user = behaviour_user['epochhrs'].quantile(0.9)
train_user = behaviour_user[behaviour_user['epochhrs'] < test_time_th_user]
valid_user = behaviour_user[behaviour_user['epochhrs'] >= test_time_th_user]


class MindDataset_user(Dataset):
    # A fairly simple torch dataset module that can take a pandas dataframe (as above),
    # and convert the relevant fields into a dictionary of arrays that can be used in a dataloader
    def __init__(self, df):
        # Create a dictionary of tensors out of the dataframe
        self.data = {
            'userIdx': torch.tensor(df.userIdx.values),
            'click': torch.tensor(df.click.values),
            'noclick': torch.tensor(df.noclick.values)
        }

    def __len__(self):
        return len(self.data['userIdx'])

    def __getitem__(self, idx):
        return {key: val[idx] for key, val in self.data.items()}


# Build datasets and dataloaders of train and validation dataframes:
bs_user = 1024
ds_train_user = MindDataset_user(train_user)
train_loader_user = DataLoader(ds_train_user, batch_size=bs_user, shuffle=True)
ds_valid_user = MindDataset_user(valid_user)
valid_loader_user = DataLoader(
    ds_valid_user, batch_size=bs_user, shuffle=False)

batch_user = next(iter(train_loader_user))

# Build a matrix factorization model


class NewsMF_user(pl.LightningModule):
    def __init__(self, num_users, num_items, dim=10):
        super().__init__()
        self.dim = dim
        self.useremb = nn.Embedding(
            num_embeddings=num_users, embedding_dim=dim)
        self.itememb = nn.Embedding(
            num_embeddings=num_items, embedding_dim=dim)

    def forward(self, user, item):
        batch_size = user.size(0)
        uservec = self.useremb(user)
        itemvec = self.itememb(item)

        score = (uservec*itemvec).sum(-1).unsqueeze(-1)

        return score

    def training_step(self, batch, batch_idx):
        batch_size = batch['userIdx'].size(0)

        score_click = self.forward(batch['userIdx'], batch['click'])
        score_noclick = self.forward(batch['userIdx'], batch['noclick'])

        scores_all = torch.concat((score_click, score_noclick), dim=1)
        # Compute loss as cross entropy (categorical distribution between the clicked and the no clicked item)
        loss = F.cross_entropy(input=scores_all, target=torch.zeros(
            batch_size, device=scores_all.device).long())

        return loss

    def validation_step(self, batch, batch_idx):
        # for now, just do the same computation as during training
        loss = self.training_step(batch, batch_idx)
        self.log("val_loss", loss, prog_bar=True, on_step=False, on_epoch=True)
        return loss

    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
        return optimizer

# Build and train the model
# mf_model_user = NewsMF_user(num_users=len(ind2user_user)+1, num_items = len(ind2item)+1)
# trainer_user = pl.Trainer(max_epochs=10, accelerator="gpu")
# trainer_user.fit(model=mf_model_user, train_dataloaders=train_loader_user, val_dataloaders=valid_loader_user)

# Save the model
# trainer_user.save_checkpoint("model_user.ckpt")


# Load the trained model
mf_model_user = NewsMF_user.load_from_checkpoint(
    checkpoint_path="model_user.ckpt", num_users=len(ind2user_user) + 1, num_items=len(ind2item) + 1)


USER_ID = 1
# Create item_ids and user ids list
item_id_user = list(ind2item.keys())
userIdx_user = [USER_ID]*len(item_id_user)


preditions_user = mf_model_user.forward(
    torch.IntTensor(userIdx_user), torch.IntTensor(item_id_user))

# Select top 10 argmax
top_index_user = torch.topk(preditions_user.flatten(), 10).indices

# Filter for top 10 suggested items
filters_user = [ind2item[ix.item()] for ix in top_index_user]
recommendedNews = news[news["id"].isin(filters_user)]
"""


@api_view(['GET'])
def getRecommendedNews(request, id):
    ind = item2ind.get(id)
    if not ind:
        recoNews = news.sort_values(
            "n_click_training", ascending=True).head(20)
        return Response(recoNews['id'])
    else:
        # This calculates the cosine similarity and outputs the 10 most similar articles w.r.t to ind in descending order
        SelectedNews = news[news['id'] == id].category.values[0]
        print(SelectedNews)
        similarity = torch.nn.functional.cosine_similarity(
            itememb[ind], itememb, dim=0)
        # y_true = similarity.argsort(descending=False)-1
        # rint(similarity)
        # print(y_true)
        most_sim = news[~news.ind.isna()].iloc[(
            similarity.argsort(descending=True).numpy()-1)]

        most_sim = most_sim[most_sim['category'] == SelectedNews]

        return Response(most_sim['id'].head(20))

    # return Response(most_sim['itemId'].head(8))


@api_view(['GET'])
def getTrendingNews(request):
    trendingNews = news.sort_values("n_click_training", ascending=False)

    return Response(trendingNews.head(100))
