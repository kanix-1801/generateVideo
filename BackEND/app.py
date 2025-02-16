from flask import Flask, render_template, request, jsonify
from endpoints.generate_script import generate_script
from endpoints.generate_prompt import generate_prompts
from endpoints.generate_video import generate_video

app = Flask(__name__)

@app.route('/')
def index():
    return "Flask App is Running!"

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    print(data)
    endpoint_map={
        'generate_script': generate_script,
        'generate_prompt': generate_prompts,
        'generate_video': generate_video
    }
    endpoint=data.get('endpoint')
    event=data.get('event')
    response=endpoint_map[endpoint](event)
    return jsonify({'status': 'success', 'message': 'Video generated successfully!', 'response': response})

if __name__ == '__main__':
    app.run(debug=True)
