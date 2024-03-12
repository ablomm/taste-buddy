from flask import Flask, request, jsonify

app = Flask(__name__)

def personalized_recommendations(data):
    # insert part to get personalized recipes
    result = "personalized recs with data " + str(data)
    return result

def top_rated_recommendations(data):
    # top rated recipe model ? 
    result = "top rated recipes" + str(data)
    return result

@app.route('/api/personalized-recommendations', methods=['POST'])
def call_personalized():
    data = request.json
    result = personalized_recommendations(data)
    return jsonify(result)

@app.route('/api/top-rated-recipes', methods=['POST'])
def call_top_rated():
    data = request.json
    result = top_rated_recommendations(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
