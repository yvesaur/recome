import pandas as pd

# Load the TSV file
df = pd.read_csv('news.tsv', delimiter='\t', header=None)

# Define column names
df.columns = ['id', 'category', 'subcategory', 'title',
              'abstract', 'url', 'title_entities', 'abstract_entities']

# Save the DataFrame to a CSV file
df.to_csv('news.csv', index=False)
