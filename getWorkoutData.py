#!/usr/bin/env python3.4

# Get workout information from .tcx files
# Run on a path containing .tcx files or a single .tcx file
# Usage:
#   (file)path as only argument
#   
# Casper Kehlet Jensen, 2015-10-13

import os
import re
import sys
import json
import xml.etree.ElementTree as ET #phone home

def stripNonsense(corruptxmltree): # .tcx files contain erroneous content
    regex = re.compile(r"(<[a-zA-Z]+)[\s][a-zA-Z]+:.*(>)")
    return regex.sub(r"\1\2", corruptxmltree)

def getData(xmltree, debug=False):
    root = ET.fromstring(xmltree)
    activity = root[0][0]
    date = activity.find("Id").text
    seconds, meters = [], []
    if debug: print("date:", date)
    for lap in activity.iter("Lap"):
        laptime = float(lap.find("TotalTimeSeconds").text)
        seconds.append(laptime)
        lapdist = float(lap.find("DistanceMeters").text)
        meters.append(lapdist)
        if debug: print("  Lap: {time:", laptime, ", dist:", lapdist, "}")
    return {"date":date, "time":sum(seconds), "dist":sum(meters)}

def parseXML(filename):
    f = open(filename, "r")
    xmltree = stripNonsense(f.read())
    f.close()
    return getData(xmltree)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        argument = sys.argv[1]
        data = []
        if os.path.isfile(argument):
            data = parseXML(argument)
        elif os.path.isdir(argument):
            for f in os.listdir(argument):
                data.append(parseXML(argument + f))
        else:
            print("ERROR: Ehh, I'm not sure what that (", argument, ") is")
            exit(1)
        print(json.dumps(data, sort_keys=True, indent=2, separators=(",",": ")))
    else:
        print("ERROR: You must specify a path or a file")
        print("Usage:")
        print("\t", sys.argv[0], "<path_or_file>")