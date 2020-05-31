import numpy as np
import os
import pickle
from constants import *


with open(LABELS_PATH, "rb") as rf:
    bboxes = pickle.load(rf)


with open("data/train.csv", "w") as wf:
    for img in os.listdir(IMAGES_PATH)[:380]:
        for bbox in bboxes[img[:3]]:     
            bbox[0, :] = ((IMAGE_DIM[0] - 1)*bbox[0, :]/5999)
            bbox[1, :] = ((IMAGE_DIM[1] - 1)*bbox[1, :]/3999)

            bbox = list(map(str, map(int, list(bbox.reshape((4))))))

            row = [IMAGES_PATH + img] + bbox + ["pedestrian"]
            wf.write(",".join(row) + "\n")


with open("data/val.csv", "w") as wf:
    for img in os.listdir(IMAGES_PATH)[380:]:
        for bbox in bboxes[img[:3]]:     
            bbox[0, :] = ((IMAGE_DIM[0] - 1)*bbox[0, :]/5999).astype("int32")
            bbox[1, :] = ((IMAGE_DIM[1] - 1)*bbox[1, :]/3999).astype("int32")

            bbox = list(map(str, map(int, list(bbox.reshape((4))))))

            row = [IMAGES_PATH + img] + bbox + ["pedestrian"]
            wf.write(",".join(row) + "\n")