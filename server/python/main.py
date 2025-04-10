import os
import logging
from flask import Flask, request, jsonify
import requests
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import openai
# import tweepy
import praw
# import facebook
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Twitter API Integration
# def fetch_twitter_posts(search_query): 
#     """
#     Fetch tweets using Twitter API v2
#     """
#     try:
#         # Twitter API credentials
#         client = tweepy.Client(
#             bearer_token=os.getenv('TWITTER_BEARER_TOKEN'),
#             consumer_key=os.getenv('TWITTER_API_KEY'),
#             consumer_secret=os.getenv('TWITTER_API_SECRET'),
#             access_token=os.getenv('TWITTER_ACCESS_TOKEN'),
#             access_token_secret=os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
#         )

#         # Search tweets
#         tweets = client.search_recent_tweets(
#             query=search_query, 
#             max_results=100,
#             tweet_fields=['text']
#         )

#         # Extract tweet texts
#         return [tweet.text for tweet in tweets.data] if tweets.data else []

#     except Exception as e:
#         logger.error(f"Twitter API Error: {e}")
#         return []

# # Facebook API Integration
# def fetch_facebook_posts(search_query):
#     """
#     Fetch posts using Facebook Graph API
#     """
#     try:
#         graph = facebook.GraphAPI(
#             access_token=os.getenv('FACEBOOK_ACCESS_TOKEN'),
#             version="3.1"
#         )

#         # Search posts (note: Facebook's search is limited)
#         search_results = graph.search(
#             type='post', 
#             q=search_query, 
#             limit=100
#         )

#         # Extract post messages
#         return [post.get('message', '') for post in search_results if 'message' in post]

#     except Exception as e:
#         logger.error(f"Facebook API Error: {e}")
#         return []

# GNews API Integration
def fetch_gnews_posts(search_query):
    """
    Fetch news articles using GNews API with pagination.
    """
    try:
        gnews_api_key = os.getenv('GNEWS_API_KEY')
        if not gnews_api_key:
            logger.error("GNEWS_API_KEY is not set.")
            return []

        url = "https://gnews.io/api/v4/search"
        params = {
            'q': search_query,
            'token': gnews_api_key,
            'lang': 'en',
            'max': 100,  # Maximum posts per request
        }

        # Initialize a list to store all fetched posts
        all_articles = []
        page = 1
        while True:
            params['page'] = page
            response = requests.get(url, params=params)
            response.raise_for_status()

            articles = response.json().get('articles', [])
            if not articles:
                break  # Stop if there are no more articles

            all_articles.extend(articles)

            # Optional: stop after a certain number of total articles
            if len(all_articles) >= 100:  # Limit to a maximum of 300 articles
                break

            page += 1  # Increment to fetch the next page

        # Format and return the articles as you wish
        return [article['title'] + " - " + article.get('description', '') for article in all_articles]

    except Exception as e:
        logger.error(f"GNews API Error: {e}")
        return []

# Reddit API Integration
def fetch_reddit_posts(search_query):
    try:
        reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_CLIENT_ID'),
            client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
            user_agent=os.getenv('REDDIT_USER_AGENT')
        )

        # Search across subreddits
        posts = []
        for submission in reddit.subreddit('all').search(search_query, limit=10):
            # Collects submission title 
            posts.append(submission.title)
            

        return posts

    except Exception as e:
        logger.error(f"Reddit API Error: {e}")
        return []

# Existing Sentiment Analysis Functions (from previous implementation)
def get_textblob_sentiment(text):
    """
    Analyze sentiment using TextBlob
    Returns a sentiment score between -1 and 1
    """
    blob = TextBlob(text)
    return blob.sentiment.polarity

def get_vader_sentiment(text):
    """
    Analyze sentiment using VADER
    Returns a compound sentiment score between -1 and 1
    """
    analyzer = SentimentIntensityAnalyzer()
    return analyzer.polarity_scores(text)['compound']

def get_genai_sentiment(text):
    """
    Analyze sentiment using OpenAI's GPT model
    Returns a sentiment score between -1 and 1
    """
    try:
        openai.api_key = os.getenv('OPENAI_API_KEY')
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a sentiment analysis assistant. Analyze the sentiment of the following text and return a score between -1 (very negative) and 1 (very positive)."},
                {"role": "user", "content": f"Analyze the sentiment of this text: {text}"}
            ]
        )
        
        # Extract sentiment score from model response
        sentiment_text = response.choices[0].message.content.strip().lower()
        
        # Try to convert response to float
        try:
            return float(sentiment_text)
        except ValueError:
            # Fallback sentiment parsing
            if 'negative' in sentiment_text:
                return -0.5
            elif 'positive' in sentiment_text:
                return 0.5
            else:
                return 0
    except Exception as e:
        logger.error(f"GenAI Sentiment Analysis Error: {e}")
        return 0

# Main Sentiment Analysis Route
@app.route("/", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON or empty request body"}), 400

        # Extract values safely
        search_query = data.get("search")
        platform = data.get("platform")
        model = data.get("model")


        # posts = fetch_reddit_posts(search_query)
        # sentiment_results = []
        # for post in posts:
        #     sentiment_score = get_vader_sentiment(post)
        #     sentiment_results.append({
        #         'text': post,
        #         'sentiment_score': sentiment_score
        #     })
        
        # total_sentiment = sum(result['sentiment_score'] for result in sentiment_results)
        # avg_sentiment = total_sentiment / len(sentiment_results) if sentiment_results else 0
         
        # return jsonify({
        #     'search_query': search_query,
        #     'platform': platform,
        #     'model': model,
        #     'total_posts': len(sentiment_results),
        #     'average_sentiment': avg_sentiment,
        #     'sentiment_details': sentiment_results
        # })

        # Validate inputs
        if not all([search_query, platform, model]):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate platform and model
        if platform not in ['twitter', 'gnews', 'reddit']:
            return jsonify({"error": "Invalid platform"}), 400
        
        if model not in ['vader', 'textblob', 'genai']:
            return jsonify({"error": "Invalid sentiment analysis model"}), 400

        # Fetch social media posts based on platform
        if platform == 'twitter':
            return 0
            # posts = fetch_twitter_posts(search_query)
        elif platform == 'gnews':
            posts = fetch_gnews_posts(search_query)
        elif platform == 'reddit':
            posts = fetch_reddit_posts(search_query)
        else:
            posts = []

        # Analyze sentiment for each post
        sentiment_results = []
        for post in posts:
            # Select sentiment analysis model
            if model == 'textblob':
                sentiment_score = get_textblob_sentiment(post)
            elif model == 'vader':
                sentiment_score = get_vader_sentiment(post)
            elif model == 'genai':
                sentiment_score = get_genai_sentiment(post)
            
            sentiment_results.append({
                'text': post,
                'sentiment_score': sentiment_score
            })

        # Calculate overall sentiment statistics
        total_sentiment = sum(result['sentiment_score'] for result in sentiment_results)
        avg_sentiment = total_sentiment / len(sentiment_results) if sentiment_results else 0

        return jsonify({
            'search_query': search_query,
            'platform': platform,
            'model': model,
            'total_posts': len(sentiment_results),
            'average_sentiment': avg_sentiment,
            'sentiment_details': sentiment_results
        })

    except Exception as e:
        logger.error(f"Sentiment Analysis Error: {e}")
        return jsonify({"error": str(e)}), 500

# Configuration and Startup
def setup_environment():
    """
    Validate environment variables on startup
    """
    required_vars = [
        'TWITTER_BEARER_TOKEN', 'TWITTER_API_KEY', 'TWITTER_API_SECRET', 
        'TWITTER_ACCESS_TOKEN', 'TWITTER_ACCESS_TOKEN_SECRET',
        'FACEBOOK_ACCESS_TOKEN',
        'REDDIT_CLIENT_ID', 'REDDIT_CLIENT_SECRET', 'REDDIT_USER_AGENT',
        'OPENAI_API_KEY'
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing environment variables: {', '.join(missing_vars)}")
        raise EnvironmentError("Please set all required environment variables")

if __name__ == "__main__":
    # Validate environment before starting
    setup_environment()
    
    # Run the Flask ap
    app.run(host='0.0.0.0', port=5000, debug=True)