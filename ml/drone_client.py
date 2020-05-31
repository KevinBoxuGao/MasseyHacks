import socketio
import base64
from PIL import Image
from PIL.ExifTags import GPSTAGS, TAGS
from io import BytesIO
import asyncio
import time
import os

EXIF_GPSINFO_ID = 34853
MLSERVER_HOTNAME = "localhost"

def get_exif(file):
    img = Image.open(file)
    return img, img._getexif()

def exif_id2gps_tag(exif):
    if not exif:
        raise ValueError("No EXIF metadata found")
    geotags = {}
    for idx, tag in TAGS.items():
        if tag == "GPSInfo":
            if idx not in exif:
                raise ValueError("No EXIF geotagging found")
            for (key, val) in GPSTAGS.items():
                if key in exif[idx]:
                    geotags[val] = exif[idx][key]
    return geotags

def dms2decimal(dms, ref):
    degrees = dms[0][0] / dms[0][1]
    minutes = dms[1][0] / dms[1][1] / 60.0
    seconds = dms[2][0] / dms[2][1] / 3600.0
    if ref in ['S', 'W']:
        degrees = -degrees
        minutes = -minutes
        seconds = -seconds
    return round(degrees + minutes + seconds, 5)

def get_coords(geotags):
    lat = dms2decimal(geotags['GPSLatitude'], geotags['GPSLatitudeRef'])
    long = dms2decimal(geotags['GPSLongitude'], geotags['GPSLongitudeRef'])
    return (lat, long)


io = socketio.AsyncClient()
await io.connect(MLSERVER_HOTNAME)

@io.on("status")
async def status(msg):
    print(msg)

for folder in os.listdir("img/"):
    for file in os.listdir("img/" + folder):
        img, exif = get_exif("img/" + folder + "/" + file)
        coords = get_coords(exif_id2gps_tag(exif))
        
        buf = BytesIO()
        img.save(buf, format = "JPEG")
        b64_str = base64.b64encode(buf.getvalue())

        io.emit("send_data", [30, *coords, b64_str])

        time.sleep(1)
