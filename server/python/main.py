import os
import logging
from flask import Flask, request, jsonify
import requests
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime, timezone

import praw
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

load_dotenv()

# Global variable for Hugging Face model (loads once, reuses many times)
_sentiment_pipeline = None

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
            if len(all_articles) >= 100:  # Limit to a maximum of 100 articles
                break

            page += 1  # Increment to fetch the next page

        # Format and return the articles
        return [{'text': article['title'] + " - " + article.get('description', ''), 
                'timestamp': article.get('publishedAt', '')} for article in all_articles]

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

        posts = []
        for submission in reddit.subreddit('all').search(search_query, sort='new', limit=50):
            full_text = f"{submission.title} {submission.selftext}".strip()

            # Basic relevance filter: must contain query terms
            if len(full_text) < 15 or search_query.lower() not in full_text.lower():
                continue

            posts.append({
                'text': full_text,
                'timestamp': submission.created_utc,
                'score': submission.score
            })

        return posts

    except Exception as e:
        logger.error(f"Reddit API Error: {e}")
        return []

def get_textblob_sentiment(text):
    """
    Analyze sentiment using TextBlob
    Returns a sentiment score between 0 and 1
    """
    blob = TextBlob(text)
    rounded_score = round((blob.sentiment.polarity + 1) / 2, 2)  # Normalize to [0, 1]
    return rounded_score

def get_vader_sentiment(text):
    """
    Analyze sentiment using VADER
    Returns a compound sentiment score between 0 and 1
    """
    analyzer = SentimentIntensityAnalyzer()
    rounded_score = round((analyzer.polarity_scores(text)['compound'] + 1) / 2, 2)  # Normalize to [0, 1]
    return rounded_score

def get_genai_sentiment(text):
    """
    Analyze sentiment using Hugging Face transformers (FREE)
    Uses a robust Twitter-trained model for better social media sentiment analysis
    """
    global _sentiment_pipeline
    
    try:
        # Initialize the pipeline only once (first time)
        if _sentiment_pipeline is None:
            logger.info("Loading Hugging Face sentiment model (one-time download)...")
            from transformers import pipeline
            _sentiment_pipeline = pipeline(
                "sentiment-analysis", 
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                return_all_scores=True
            )
            logger.info("✅ Hugging Face model loaded successfully!")
        
        # Clean and truncate text for better processing
        text = text.strip()
        if len(text) > 500:
            text = text[:500] + "..."
        
        # Skip very short texts
        if len(text) < 10:
            return 0.5
        
        # Get sentiment scores
        results = _sentiment_pipeline(text)[0]  # [0] because return_all_scores=True returns a list
        
        # Extract scores for each sentiment
        negative_score = next((r['score'] for r in results if r['label'] == 'LABEL_0'), 0)
        neutral_score = next((r['score'] for r in results if r['label'] == 'LABEL_1'), 0)
        positive_score = next((r['score'] for r in results if r['label'] == 'LABEL_2'), 0)
        
        # Calculate compound score similar to VADER (0 = negative, 1 = positive)
        total = positive_score + neutral_score + negative_score
        if total == 0:
            logger.warning("⚠️ Zero division avoided: All sentiment scores are 0. Defaulting to neutral.")
            return 0.5  # neutral default

        compound_score = (positive_score + (neutral_score * 0.5)) / total

        
        return round(compound_score, 2)
        
    except ImportError:
        logger.warning("⚠️  Hugging Face transformers not installed. Install with: pip install transformers torch")
        logger.info("Falling back to VADER sentiment analysis...")
        return get_vader_sentiment(text)
    except Exception as e:
        logger.error(f"Hugging Face Sentiment Analysis Error: {e}")
        # Fallback to VADER if Hugging Face fails
        logger.info("Falling back to VADER sentiment analysis...")
        return get_vader_sentiment(text)

# Main Sentiment Analysis Route
@app.route("/", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON or empty request body"}), 400

        # Extract values 
        search_query = data.get("search")
        platform = data.get("platform")
        model = data.get("model")

        # Validate inputs
        if not all([search_query, platform, model]):
            return jsonify({"error": "Missing required fields"}), 400

        # Validate platform and model
        if platform not in ['twitter', 'gnews', 'reddit']:
            return jsonify({"error": "Invalid platform"}), 400
        
        if model not in ['vader', 'textblob', 'genai']:
            return jsonify({"error": "Invalid sentiment analysis model"}), 400

        # Fetch social media posts based on platform
        if platform == 'gnews':
            posts = fetch_gnews_posts(search_query)
        elif platform == 'reddit':
            posts = fetch_reddit_posts(search_query)
        else:
            posts = []

        # Check which model is selected
        if model == 'textblob':
            sentiment_func = get_textblob_sentiment
        elif model == 'vader':
            sentiment_func = get_vader_sentiment
        elif model == 'genai':
            sentiment_func = get_genai_sentiment

        # Analyze sentiment for each post
        sentiment_results = []
        for post in posts:
            text = post['text']
            raw_time = post['timestamp']

            # Convert timestamp into date string
            if platform == 'reddit':
                date_str = datetime.fromtimestamp(raw_time, tz=timezone.utc).strftime('%Y-%m-%d')
            elif platform == 'gnews':
                try:
                    from dateutil import parser
                    date_str = parser.parse(raw_time).strftime('%Y-%m-%d')
                except:
                    date_str = datetime.now().strftime('%Y-%m-%d')
            else:
                date_str = None

            sentiment_score = sentiment_func(text)
            sentiment_results.append({
                'description': text,
                'sentiment_score': sentiment_score,
                'date': date_str
            })

        # Calculate overall sentiment statistics
        total_sentiment = sum(result['sentiment_score'] for result in sentiment_results)
        avg_sentiment = total_sentiment / len(sentiment_results) if sentiment_results else 0

        return jsonify({
            'search_query': search_query,
            'platform': platform,
            'model': model,
            'total_posts': len(sentiment_results),
            'average_sentiment': round(avg_sentiment, 2),
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
        'REDDIT_CLIENT_ID', 
        'REDDIT_CLIENT_SECRET', 
        'REDDIT_USER_AGENT',
        'GNEWS_API_KEY'
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing environment variables: {', '.join(missing_vars)}")
        raise EnvironmentError("Please set all required environment variables")
    
    # Check if Hugging Face transformers is available
    try:
        import transformers
        logger.info("✅ Hugging Face transformers available - GenAI sentiment analysis ready!")
    except ImportError:
        logger.warning("⚠️  Hugging Face transformers not installed. GenAI will fallback to VADER.")
        logger.info("Install with: pip install transformers torch")
    
    logger.info("🚀 App setup complete!")

if __name__ == "__main__":
    # Validate environment before starting
    setup_environment()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)