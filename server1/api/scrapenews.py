import newspaper
import psycopg2
from newspaper import ArticleException
import nltk
nltk.download('punkt')

# SCRAPE NEWS IN DAILYMAIL
def scrape_news():
    print("PRINT NEWS");