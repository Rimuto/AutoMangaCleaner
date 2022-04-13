import os
from flask import Flask, request, redirect, url_for, render_template, send_from_directory
import detect
import cv2
import clean
#from pyfladesk import init_gui

import base64
import numpy as np

labelsPath = "YOLOv4/obj.names"
cfgpath = "YOLOv4/yolov4-obj.cfg"
wpath = "YOLOv4/yolov4-obj_final.weights"

application  = Flask(__name__)
application.config["SECRET_KEY"] = "SECRET_KEY"
DOWNLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + '\\downloads\\'
application.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER
ALLOWED_EXTENSIONS = {'jpg', 'png'}

CFG = detect.config(cfgpath)
Weights = detect.weights(wpath)
nets = detect.load_model(CFG, Weights)
#new comment for deploy heroku2

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')


def get_path(filename):
    return os.path.join("./" + filename)


@application.route("/uploadajax", methods=[ "GET",'POST'])
def uploadajax():
    files = request.files.getlist("file")
    data = {}
    for i, file in zip(range(len(files)),files):
        if file.filename == '':
            print('No file selected')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            npimg = np.frombuffer(file.read(), np.uint8)
            img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            res, bboxes = detect.detect(nets, img.copy())
            cl = []
            for j in bboxes:
                x = j[0]
                y = j[1]
                w = j[2]
                h = j[3]
                cropped = img[y:y + h, x:x + w]
                ret, buffer = cv2.imencode('.png', cropped)
                cl.append([x, y, base64.b64encode(buffer).decode('utf-8')])
                cleaned = clean.remove(cropped)
                img[y: y + h, x: x + w] = cleaned

            retval, buffer_img = cv2.imencode('.png', img)
            data[i] = {"pack": {"cleaned": cl, "img": base64.b64encode(buffer_img).decode('utf-8')}}
            #data[i] = {"img": base64.b64encode(buffer_img).decode('utf-8')}
    return data


@application.route("/")
def index():
    return render_template("index.html")

def start_server():
    application.run()

if __name__ == '__main__':
    #init_gui(app, width=300, height=400,)
    application.run(host='0.0.0.0')