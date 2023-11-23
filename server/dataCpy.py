# import psycopg2
# from sqlalchemy import create_engine
# import pandas as pd

# Create a connection to the PostgreSQL database
# engine = create_engine('postgresql://postgres:postgres@localhost:5432/recome')

# Load the TSV file into a DataFrame
# df = pd.read_csv('news.tsv', delimiter='\t', header=None)
# dh = pd.read_csv('behaviors.tsv', delimiter='\t', header=None)

# Define column names
# df.columns = ['id', 'category', 'subcategory', 'title',
#              'abstract', 'url', 'title_entities', 'abstract_entities']
# dh.columns = ['id', 'userid', 'timestamp', 'click_history',
#             'impressions']

# Write records stored in the DataFrame to the PostgreSQL table
# df.to_sql('news', engine, if_exists='append', index=False)
# dh.to_sql('behaviours', engine, if_exists='append', index=False)
