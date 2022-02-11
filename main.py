from flask import Flask, render_template, request, url_for
import os
import json
import base64

app = Flask(__name__)
app.config["SECRET_KEY"] = "SECRET_KEY"
DOWNLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + '\\downloads\\'
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER

import base64


def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')


def get_path(filename):
    return os.path.join("./" + filename)

@app.route("/uploadajax", methods=[ "GET",'POST'])
def uploadajax():
    files = request.files.getlist("file")
    print(files)
    for file in files:
        file.save("./downloads/" + file.filename)
    data = {}
    for i, file in zip(range(len(files)),files):
        print(file.filename)
        data[i] ={"img": get_base64_encoded_image("./downloads/" + file.filename)}
    #print(data)
    return data


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
