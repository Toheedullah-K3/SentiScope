from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])  # Accepts both GET & POST
def home():
    if request.method == 'POST':
        data = request.get_json()
        search_query = data.get("search", "No search term provided")
        return jsonify({"message": f"Received Python search term: {search_query}"})
    return "Flask Server is Running!", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
