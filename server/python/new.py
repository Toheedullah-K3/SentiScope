from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["POST"])
def search_tweets():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON or empty request body"}), 400

        # Extract values safely
        search = data.get("search")
        platform = data.get("platform")
        model = data.get("model")

        if not all([search, platform, model]):
            return jsonify({"error": "Missing required fields"}), 400

        return jsonify({"search": search, "platform": platform, "model": model})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)  # Remove debug=True for production
