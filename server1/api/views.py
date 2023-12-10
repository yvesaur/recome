import requests
import psycopg2
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

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname="recome",
    user="postgres",
    password="postgres",
    host="localhost",
    port="5432"
)

# Create a cursor object
cur = conn.cursor()

# Close the connection
# cur.close()
# conn.close()

# Execute a query for behaviours
cur.execute("SELECT * FROM news1")
# Fetch all the rows for news
rows = cur.fetchall()
column_names = [desc[0] for desc in cur.description]  # Get the column names
# Create a DataFrame from the rows, with the column names
data = pd.DataFrame(rows, columns=column_names)

data.columns = [
    'News ID',
    "Category",
    "SubCategory",
    "Title",
    "Abstract",
    "URL",
    "Title Entities",
    "Abstract Entities",
    "Author",
    "Date"
]

print('the number of articles before processing :', len(data))
data.drop_duplicates(subset=['Title'], inplace=True)
print('The number of articles after processing :', len(data))

data.isna().sum()

data.dropna(inplace=True)

print('the number of articles before processing :', len(data))
data = data[data['Title'].apply((lambda x: len(x.split()) >= 4))]
print('The number of articles after processing :', len(data))

df2 = data.copy()

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


# Making a function to lemmatize all the words
lemmatizer = WordNetLemmatizer()


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


# Removing Stop words from Title Column
rem_stopwords_tokenize(data, 'Title')

# Lemmatizing the Title column
lemmatize_all(data, 'Title')

# Making a copy of data to use in the future
data4 = data.copy()


def convert_to_string(data, name):
    t = data[name].values
    p = []
    for i in t:
        listToStr = ' '.join(map(str, i))
        p.append(listToStr)
    data[name] = p


convert_to_string(data, 'Title')

headline_vectorizer = CountVectorizer()

recome_headline_vectorizer = TfidfVectorizer(min_df=0)


def recomeModel(row_index, num_similar_items):
    cate = data['Category'][row_index]
    name = data['Title'][row_index]
    cate_data = data[data['Category'] == cate]

    row_index2 = cate_data[cate_data['Title'] == name].index
    headline_features = recome_headline_vectorizer.fit_transform(cate_data['Title'].values)
    couple_dist = pairwise_distances(headline_features, headline_features[row_index2])
    indices = np.argsort(couple_dist.ravel())[0:num_similar_items]
    df = pd.DataFrame({'headline': df2[df2['Category'] == cate]['Title'].values[indices],
                       'Category': cate_data['Category'].values[indices],
                       'Abstract': cate_data['Abstract'].values[indices],
                       'Euclidean Distance Similarity': couple_dist[indices].ravel()})
    return df.iloc[1:, :]


@api_view(['GET'])
def getRecommendedNews(request, id):
    ind = df2[df2['News ID'] == id].index[0]
    print(ind)
    dd = recomeModel(ind, 10)
    dd.head(10)
    return Response(dd.head(10))


@api_view(['GET'])
def getTrendingNews(request):

    return Response("TEST")
