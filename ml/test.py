"""import xmltodict
import json

with open("592.xml", "r") as rf:
    xml = rf.read()
    data = xmltodict.parse(xml)

print(data["annotation"]["object"][0]["polygon"]["pt"])"""

import pickle
import numpy as np

with open("imgIdToBBoxArray.p", "rb") as rf:
    data = pickle.load(rf)

x = data["000"][5]

x[0, :] = (599*x[0, :]/5999).astype("int32")
x[1, :] = (599*x[1, :]/3999).astype("int32")

print(x.reshape((4)))

#TODO: ZERO BASED INDEXING OR NO?