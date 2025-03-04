from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load CSV only once (Improve performance)
CSV_FILE = r"D:\SentiScope\server\python\data\data.csv"

df = pd.read_csv(CSV_FILE, encoding="ISO-8859-1", header=None, usecols=[0, 4, 5], names=["sentiment", "username", "tweet_text"])

@app.route("/", methods=["POST"])
def search_tweets():
    try:
        data = request.get_json()
        search_query = data.get("search", "").lower()

        if not search_query:
            return jsonify({"error": "Search query is required"}), 400

        # Use pandas filtering for fast searching
        results = df[df["tweet_text"].str.contains(search_query, case=False, na=False)]

        # Convert to JSON and return only top 20 results (faster response)
        return jsonify(results.head(20).to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
