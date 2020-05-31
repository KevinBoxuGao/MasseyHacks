import torch
import torch.nn as nn
import numpy as np

import gnupg
import aiohttp
import socketio
import asyncio

import cv2
import base64
import re
from PIL import Image

# TODO: Edit takeoff_status event callback to communicate with drone(s).
# TODO: Draw bounding boxes on images and save them to outs.


model_path = "model/aerial_retinanet.pt"
server_path = "https://covmapsbackend--cristianbicheru.repl.co"
ON_CUDA = torch.cuda.is_available()


# Load model.
retinanet = torch.load(model_path)
if ON_CUDA:
    retinanet = retinanet.cuda()
    retinanet = nn.DataParallel(retinanet).cuda()
else:
    retinanet = nn.DataParallel(retinanet)
retinanet.eval()


# Server to connect with drone(s).
app = aiohttp.web.Application()
server_io = socketio.AsyncServer(async_mode = "aiohttp")
server_io.attach(app)

# Client to connect with backend server.
io = socketio.Client()
io.connect("https://covmapsbackend--cristianbicheru.repl.co")


# Callbacks for communications with backend server.
@io.on("authenticate_status")
def status(msg):
    print(msg)

@io.on("takeoff_status")
def status(msg):
    print(msg)


# Callbacks for drone communications.
@server_io.event
async def connect(sid, env):
    await server_io.emit("status", "Connection accepted (sid: " + str(sid) + ")\nAwaiting takeoff coordinates...", room = sid)

@server_io.on("takeoff")
async def takeoff(sid, data):
    # Forward takeoff data to backend server.
    io.emit("takeoff", data)
    await server_io.emit("status", "Takeoff data logged.", room = sid)

@server_io.on("send_data")
async def send_data(sid, data):
    # Compute n_ppl in image received from drone and forward that plus position info to backend server.
    alt, lat, long, b64_img = data

    #b64_img = re.sub('^data:image/.+;base64,', '', b64_img) <-- This might be needed if there's a "data:image/<filetype>;base64" header.
    img = np.array(Image.open(io.BytesIO(base64.b64decode(b64_img))))
    #img = torch.Tensor(cv2.resize(img, (600, 600))) <-- Uncomment this if image isn't resized in Java.

    if ON_CUDA:
        img = img.cuda()
    
    img = img.permute(2, 0, 1)
    img = img.view(1, *img.size()).float()/255.0

    scores, _, _ = retinanet(img)
    n_ppl = np.where(scores.cpu() > 0.5)[0].shape[0]

    io.emit("logdata", [alt, lat, long, n_ppl])
    await server_io.emit("status", ":ogged " + str([alt, lat, long, n_ppl]), room = sid)


# Random landing page.
async def index(req):
    return aiohttp.web.Response(text = "<h1>no</h1>", content_type = "text/html")


# Authenticate with backend server.
gpg = gnupg.GPG()
with open("privkey", "r") as f:
    gpg.import_keys(f.read())
io.emit("authenticate", str(gpg.sign("auth")))

# Run app.
app.router.add_get('/', index)
aiohttp.web.run_app(app)
