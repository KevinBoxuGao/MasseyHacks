import socketio
import base64
from PIL import Image
from PIL.ExifTags import TAGS


def get_exif(file):
    img = Image.open(file)
    img.verify()
    return img._getexif()

