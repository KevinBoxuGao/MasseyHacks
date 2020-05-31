import numpy as np
import os
import pickle
from constants import *


with open("imgIdToBBoxArray.p", "rb") as rf:
    bboxes = pickle.load(rf)


with open("data/train.csv", "w") as wf:
    for img in os.listdir(IMAGES_PATH)[:380]:
        for bbox in bboxes[img[:3]]:     
            bbox[0, :] = ((IMAGE_DIM[0] - 1)*bbox[0, :]/5999).astype("int32")
            bbox[1, :] = ((IMAGE_DIM[1] - 1)*bbox[1, :]/3999).astype("int32")

            bbox = bbox.reshape((4))

            row = [IMAGES_PATH + img] + list(bbox) + ["pedestrian"]
            wf.write(",".join(row) + "\n")


with open("data/val.csv", "w") as wf:
    for img in os.listdir(IMAGES_PATH)[380:]:
        for bbox in bboxes[img[:3]]:     
            bbox[0, :] = ((IMAGE_DIM[0] - 1)*bbox[0, :]/5999).astype("int32")
            bbox[1, :] = ((IMAGE_DIM[1] - 1)*bbox[1, :]/3999).astype("int32")

            bbox = bbox.reshape((4))

            row = [IMAGES_PATH + img] + list(bbox) + ["pedestrian"]
            wf.write(",".join(row) + "\n")