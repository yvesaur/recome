import pandas as pd
import psycopg2
from sqlalchemy import create_engine

# Read the CSV file
df = pd.read_csv('news.csv')

# Create an engine instance
alchemyEngine = create_engine(
    'postgresql+psycopg2://postgres:postgres@localhost:5432/recome', pool_recycle=3600)

# Connect to PostgreSQL server
dbConnection = alchemyEngine.connect()

# Write data into PostgreSQL table
df.to_sql('news', dbConnection, if_exists='replace')

# Close the database connection
dbConnection.close()
