from flask import Flask, render_template, request, jsonify
from endpoints.generate_script import generate_script
from endpoints.generate_prompt import generate_prompts
from endpoints.generate_video import generate_video
from werkzeug.utils import secure_filename
import os
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app,supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/')
def index():
    return "Flask App is Running!"

@app.route('/generate', methods=['POST'])
def generate():
    print(request)
    file_path=""
    if "file" in request.files:
        file=request.files['file']
        if file and file.filename:
            print(file.filename)
            filename = secure_filename(file.filename)
            file_path = os.path.join("../frontEND/public/Storage/uploaded_files", filename)
            file.save(file_path)
            data = request.form.get("data")
            data = json.loads(data)
            if file_path:
                data['event']['file_path']=file_path
        else:
            data = request.json
    else:
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
