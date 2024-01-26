import requests
import psycopg2
import os
from dotenv import load_dotenv

from rest_framework.response import Response
from rest_framework.decorators import api_view

import pandas as pd
import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
# Below libraries are for feature representation using sklearn
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
# Below libraries are for similarity matrices using sklearn
from sklearn.metrics import pairwise_distances
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

import torch.nn as nn
import pytorch_lightning as pl
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
import torch
from typing import List
from collections import Counter

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

import newspaper
import psycopg2
from newspaper import ArticleException
nltk.download('punkt')

# Define global variables
global cur, data, df2, lemmatizer, data4, headline_vectorizer, recome_headline_vectorizer
global raw_behaviour, unique_userIds, ind2user, user2ind, news, ind2item, item2ind
global behaviour, test_time_th, train, valid, full, bs, ds_train, train_loader
global ds_valid, valid_loader, batch, mf_model, trainer, valid_batch, predictions, true_values

def train_models():
    global cur, data, df2, lemmatizer, data4, headline_vectorizer, recome_headline_vectorizer
    global raw_behaviour, unique_userIds, ind2user, user2ind, news, ind2item, item2ind
    global behaviour, test_time_th, train, valid, full, bs, ds_train, train_loader
    global ds_valid, valid_loader, batch, mf_model, trainer, valid_batch, predictions, true_values


    # Start the process of scraping news first
    scrape_news()

    print("TRAINING MODEL: Job executed at", datetime.now())
    # Execute a query for behaviours
    cur.execute("SELECT * FROM news")
    # Fetch all the rows for news
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]  # Get the column names
    # Create a DataFrame from the rows, with the column names
    data = pd.DataFrame(rows, columns=column_names)

    data.columns = [
        'News ID',
        "Category",
        "Title",
        "IMG URL",
        "Abstract",
        "URL",
        "Author",
        "Date"
    ]

    # print('the number of articles before processing :', len(data))
    data.drop_duplicates(subset=['Title'], inplace=True)
    # print('The number of articles after processing :', len(data))

    data.isna().sum()

    data.dropna(inplace=True)

    # print('the number of articles before processing :', len(data))
    data = data[data['Title'].apply((lambda x: len(x.split()) >= 4))]
    # print('The number of articles after processing :', len(data))

    df2 = data.copy()

    # Making a function to lemmatize all the words
    lemmatizer = WordNetLemmatizer()

    # Removing Stop words from Title Column
    rem_stopwords_tokenize(data, 'Title')

    # Lemmatizing the Title column
    lemmatize_all(data, 'Title')

    # Making a copy of data to use in the future
    data4 = data.copy()

    convert_to_string(data, 'Title')

    headline_vectorizer = CountVectorizer()

    recome_headline_vectorizer = TfidfVectorizer(min_df=0)

    #==========================================

    # Execute a query for behaviours
    cur.execute("SELECT * FROM behaviours")
    # Fetch all the rows for news
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description] # Get the column names 
    raw_behaviour = pd.DataFrame(rows, columns=column_names) # Create a DataFrame from the rows, with the column names

    # print(f"The dataset originally consists of {len(raw_behaviour)} number of interactions.")
    # raw_behaviour.head()


    ## Indexize users
    unique_userIds = raw_behaviour['userid'].unique()
    # Allocate a unique index for each user, but let the zeroth index be a UNK index:
    ind2user = {idx +1: itemid for idx, itemid in enumerate(unique_userIds)}
    user2ind = {itemid : idx for idx, itemid in ind2user.items()}
    # print(f"We have {len(user2ind)} unique users in the dataset")

    # Create a new column with userIdx:
    raw_behaviour['userIdx'] = raw_behaviour['userid'].map(lambda x: user2ind.get(x,0))
    # raw_behaviour.head()


    # Execute a query for news
    cur.execute("SELECT * FROM news")
    # Fetch all the rows for news
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description] # Get the column names 
    news = pd.DataFrame(rows, columns=column_names) # Create a DataFrame from the rows, with the column names
    # print(f"The news data consist in total of {len(news)} number of news.")

    # Build index of items
    ind2item = {idx +1: itemid for idx, itemid in enumerate(news['id'].values)}
    item2ind = {itemid : idx for idx, itemid in ind2item.items()}

    # news.head()


    raw_behaviour['click_history_idx'] = raw_behaviour.click_history.map(lambda s:  process_click_history(s))
    # raw_behaviour.head()


    raw_behaviour['noclicks'], raw_behaviour['click'] = zip(*raw_behaviour['impressions'].map(process_impression))
    # We can then indexize these two new columns:
    raw_behaviour['noclicks'] = raw_behaviour['noclicks'].map(lambda list_of_strings: [item2ind.get(l, 0) for l in list_of_strings])
    raw_behaviour['click'] = raw_behaviour['click'].map(lambda x: item2ind.get(x,0))

    # raw_behaviour.head()


    # convert timestamp value to hours since epoch
    raw_behaviour['epochhrs'] = pd.to_datetime(raw_behaviour['timestamp']).values.astype(np.int64)/(1e6)/1000/3600
    raw_behaviour['epochhrs'] = raw_behaviour['epochhrs'].round()

    ## find first publish date
    #raw_behaviour[['click','epochhrs']].groupby("click").min("epochhrs").reset_index()


    ## Select the columns that we now want to use for further analysis
    behaviour = raw_behaviour[['epochhrs','userIdx','click_history_idx','noclicks','click']]
    # behaviour.head()


    behaviour.loc[:,'noclick'] = behaviour['noclicks'].map(lambda x : x[0] if len(x) > 0 else 0)
    # behaviour.head()


    # Let us use the last 10pct of the data as our validation data:
    test_time_th = behaviour['epochhrs'].quantile(0.9)
    train = behaviour[behaviour['epochhrs']< test_time_th]
    valid =  behaviour[behaviour['epochhrs']>= test_time_th]
    full = behaviour[behaviour['epochhrs'] == behaviour['epochhrs'].max()]


    # Build datasets and dataloaders of train and validation dataframes:
    bs = 1024
    ds_train = MindDataset(df=train)
    train_loader = DataLoader(ds_train, batch_size=bs, shuffle=True)
    ds_valid = MindDataset(df=valid)
    valid_loader = DataLoader(ds_valid, batch_size=bs, shuffle=False)

    batch = next(iter(train_loader))


    mf_model = NewsMF(num_users=len(ind2user)+1, num_items = len(ind2item)+1, dim=15)

    trainer = pl.Trainer(max_epochs=50, accelerator="cpu")
    trainer.fit(model=mf_model, train_dataloaders=train_loader, val_dataloaders=valid_loader)

    # Save the model
    # trainer.save_checkpoint("model_user1.ckpt")

    # Load the trained model
    # mf_model = NewsMF.load_from_checkpoint(checkpoint_path="model_user1.ckpt", num_users=len(ind2user)+1, num_items = len(ind2item)+1, dim=15) 


    valid_batch = next(iter(valid_loader))
    predictions = mf_model.predict(valid_batch["userIdx"])
    true_values = [item.item() for item in valid_batch["click"]]


    # print("MODEL ACCURACY: ", accuracy_at_k(predictions, true_values))

    ## Add more information to the article data 
    # The item index
    news["ind"] = news["id"].map(item2ind)
    # print(news["ind"])
    # Number of clicks in training data per article, investigate the cold start issue
    news["n_click_training"] = news["ind"].map(dict(Counter(raw_behaviour.click))).fillna(0)
    # 5 most clicked articles
    # news.sort_values("n_click_training",ascending=False).head()

# ===== FUNCTIONS ===== #

# SCRAPE NEWS IN DAILYMAIL
def scrape_news():
    # Fetch news articles from DailyMail
    print("\nFetching news articles from DailyMail...\n")
    newspaper_list = newspaper.build('https://www.dailymail.co.uk/')
    count = 0

    for article in newspaper_list.articles:
        count = count + 1
        # print(article.url)

    print("\nFETCHED NEWSPAPER ARTICLES: " + str(count) + " news") 

    # Insert all the fetched articles into the database
    print("\nInserting fetched articles into the database...")
    for article in newspaper_list.articles:
        # Skip the article if the URL contains "#comments" or "#video"
        if "#comments" in article.url or "#video" in article.url:
            # print("Irrelevant Article")
            continue

        try:
            article.download()
            article.parse()
            article.nlp()
        except ArticleException:
            print(f"Failed to download or parse article: {article.url}")
            continue
        
        # Split the URL into parts
        parts = article.url.split('/')
        # The category is usually the part after the base URL
        category = parts[3]  # Adjust this index based on the URL structure

        cur.execute("SELECT COUNT(*) FROM news")
        newsID =  "N" + str(cur.fetchone()[0] + 33)

        # Define the SELECT query
        select_query = "SELECT * FROM news WHERE title = %s"

        # Execute the SELECT query
        cur.execute(select_query, (article.title,))

        # Fetch the result
        result = cur.fetchone()

        # If the result is None, then the title does not exist in the table
        if result is None and len(category) <= 20:
            # Define the INSERT query
            query = "INSERT INTO news (id, category, title, img_url, abstract, url, author, date) VALUES(%s,%s,%s,%s,%s,%s,%s,%s)"

            # Define the values
            values = (newsID, category, article.title, article.top_image, article.summary, article.url, article.authors[0] if article.authors else None, article.publish_date)

            # Execute the INSERT query
            cur.execute(query,values)

            # Commit the changes
            conn.commit()

    print("\nNEWSPAPER SCRAPING DONE") 

# This function is to remove stopwords from a particular column and to tokenize it
def rem_stopwords_tokenize(data, name):

    def getting(sen):
        example_sent = sen

        stop_words = set(stopwords.words('english'))

        word_tokens = word_tokenize(example_sent)

        filtered_sentence = [w for w in word_tokens if not w in stop_words]

        filtered_sentence = []

        for w in word_tokens:
            if w not in stop_words:
                filtered_sentence.append(w)
        return filtered_sentence
    x = []
    for i in data[name].values:
        x.append(getting(i))
    data[name] = x

# Lemmatize all the words
def lemmatize_all(data, name):
    arr = data[name]
    a = []
    for i in arr:
        b = []
        for j in i:
            x = lemmatizer.lemmatize(j, pos='a')
            x = lemmatizer.lemmatize(x)
            b.append(x)
        a.append(b)
    data[name] = a

def convert_to_string(data, name):
    t = data[name].values
    p = []
    for i in t:
        listToStr = ' '.join(map(str, i))
        p.append(listToStr)
    data[name] = p


# Indexize click history field
def process_click_history(s):
    list_of_strings = str(s).split(" ")
    return [item2ind.get(l, 0) for l in list_of_strings]

def process_impression(s):
    list_of_strings = s.split(" ")
    itemid_rel_tuple = [l.split("-") for l in list_of_strings]
    noclicks = []
    click = None  # Initialize click
    for entry in itemid_rel_tuple:
        if entry[1] =='0':
            noclicks.append(entry[0])
        if entry[1] =='1':
            click = entry[0]
    return noclicks, click

# ===== FUNCTIONS ===== #

# ===== MODELS ===== #
# News Recommendations model for News
def recomeModel(row_index, num_similar_items):
    try:
        cate = data['Category'][row_index]
        name = data['Title'][row_index]
        cate_data = data[data['Category'] == cate]
        cate_data = cate_data.reset_index(drop=True)

        row_index2 = cate_data[cate_data['Title'] == name].index
        headline_features = recome_headline_vectorizer.fit_transform(cate_data['Title'].values)
        couple_dist = pairwise_distances(headline_features, headline_features[row_index2])
        indices = np.argsort(couple_dist.ravel())[0:num_similar_items]
        df = pd.DataFrame({'NewsID': cate_data[cate_data['Category'] == cate]['News ID'].values[indices],
                            'headline': cate_data[cate_data['Category'] == cate]['Title'].values[indices],
                           'Category': cate_data['Category'].values[indices],
                           'Abstract': cate_data['Abstract'].values[indices],
                           'Euclidean Distance Similarity': couple_dist[indices].ravel()})
        return df.iloc[1:, :]
    except IndexError:
        return pd.DataFrame(df2[df2['Category'] == cate])  # return an empty DataFrame in case of an IndexError

# Build a matrix factorization model
class NewsMF(pl.LightningModule):
    def __init__(self, num_users, num_items, dim = 10):
        super().__init__()
        self.dim=dim
        self.useremb = nn.Embedding(num_embeddings=num_users, embedding_dim=dim)
        self.itememb = nn.Embedding(num_embeddings=num_items, embedding_dim=dim)

    def step(self, batch, batch_idx, phase="train"):
        batch_size = batch['userIdx'].size(0)
        score_click = self.forward(batch["userIdx"], batch["click"])
        score_noclick = self.forward(batch["userIdx"], batch["noclick"])         
        scores_all = torch.concat((score_click, score_noclick), dim=1)
        loss = F.cross_entropy(input=scores_all, target=torch.zeros(batch_size, device=scores_all.device).long())
        return loss
    
    def forward(self, users, items):
        uservec =  self.useremb(users)
        itemvec = self.itememb(items)
        score = (uservec*itemvec).sum(-1).unsqueeze(-1)
        return score
               
        
    def predict_single_user(self, user_idx):
        items = torch.arange(0, len(ind2item))
        user = torch.zeros_like(items) + user_idx
        scores = self.forward(user, items)
        recommendations = [item.item() for item in torch.topk(scores, 500, dim=0)[1]]
        return recommendations
    
    def predict(self, users):
        recommendations = []
        for user in users:
            recommendation = self.predict_single_user(user)
            recommendations.append(recommendation) 
        return recommendations        
        
    def training_step(self, batch, batch_idx):
        return self.step(batch, batch_idx, "train")
    
    def validation_step(self, batch, batch_idx):
        # for now, just do the same computation as during training
        return self.step(batch, batch_idx, "val")

    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.parameters(), lr=1e-3)
        return optimizer  
    
class MindDataset(Dataset):
    # A fairly simple torch dataset module that can take a pandas dataframe (as above), 
    # and convert the relevant fields into a dictionary of arrays that can be used in a dataloader
    def __init__(self, df):
        # Create a dictionary of tensors out of the dataframe
        self.data = {
            'userIdx' : torch.tensor(df.userIdx.values),
            'click' : torch.tensor(df.click.values),
            'noclick' : torch.tensor(df.noclick.values)
        }
    def __len__(self):
        return len(self.data['userIdx'])
    def __getitem__(self, idx):
        return {key: val[idx] for key, val in self.data.items()}

def accuracy_at_k(predictions: List[List], true_values: List):
    hits = 0
    for preds, true in zip(predictions, true_values):
        if true in preds:
            hits += 1
    return hits / len(true_values)
# ===== MODELS ===== #

#==========================================

# Load environment variables from .env file
load_dotenv()

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

# Create a cursor object
cur = conn.cursor()

# Fetch News and Train Model first when server first start
train_models()


# ===== RE-TRAINING MODEL (EVERY 4AM) ===== #
scheduler = BackgroundScheduler()
scheduler.add_job(train_models, 'interval', hours=1)
scheduler.start()
# ===== RE-TRAINING MODEL (EVERY 4AM) ===== #


# ===== API REQUESTS ===== #
@api_view(['GET'])
def getRecommendedNews(request, id):
    if id in df2['News ID'].values:
        ind = df2[df2['News ID'] == id].index[0]
        # print(ind)
        dd = recomeModel(ind, 10)
        dd.head(10)
        return Response(dd['NewsID'].head(10))
    else:
        print("News ID does not exist")
        ind = None

@api_view(['GET'])
def getTrendingNews(request):
    # 5 most clicked articles
    # news.sort_values("n_click_training",ascending=False).head()
    trendingnews = news.sort_values("n_click_training",ascending=False)
    return Response(trendingnews.head(50))

@api_view(['GET'])
def getUserRecommendedNews(request, id):
    if id in raw_behaviour['userid'].values:
        user_idx = raw_behaviour[raw_behaviour["userid"] == id].userIdx.values[0]
        items = torch.arange(0, len(ind2item))
        user = torch.zeros_like(items) + user_idx
        recommendations = mf_model.predict_single_user(user)
        userRecommendations = news[news.id.isin([(ind2item[item + 1])  for item in recommendations])]
        return Response(userRecommendations['id'].head(150))
    else:
        # Execute a query for behaviours
        cur.execute("SELECT * FROM news WHERE date IS NOT NULL ORDER BY date DESC LIMIT 150") 
        # Fetch all the rows for news
        rows = cur.fetchall()
        column_names = [desc[0] for desc in cur.description] # Get the column names 
        coldStartUserRecommendations = pd.DataFrame(rows, columns=column_names) # Create a DataFrame from the rows, with the column names
        return Response(coldStartUserRecommendations['id'])
# ===== API REQUESTS ===== #