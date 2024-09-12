# -*- coding: utf-8 -*-
import os
import json
import hashlib
import cv2
import filebd

from PIL import Image
from heic2png import HEIC2PNG

path = os.path.abspath(os.curdir)+"/config/"

Conf = open(path+"serv.conf", 'r')
Conf = json.load(Conf)

def createpervfile(file,folder,uuid,ovner,originaltite):
    basename, extension = os.path.splitext(file)
    if extension == ".jpg" or extension == ".JPG" or extension == ".png" or  extension == ".PNG":
        im = Image.open(folder+"/"+file)
        size=(50,50)
        out = im.resize(size)
        out.save(folder+"/"+"prev_"+file)
        filebd.createFile(file,originaltite,"PREWIEV-FILE",'prev_',ovner,uuid+"_prev","none",folder+"/"+"prev_"+file,"")
        im = Image.open(folder+"/"+file)
        w = int(im.size[0]/4)
        h = int(im.size[1]/4)
        if im.size[0] < 400:
            out.save(folder+"/"+"prevx2_"+file)
            filebd.createFile(file,originaltite,"PREWIEV-FILE",'prevx2_',ovner,uuid+"_prevx2","none",folder+"/"+"prevx2_"+file,"")
            return "ok"
        size=(w,h)
        out = im.resize(size)
        out.save(folder+"/"+"prevx2_"+file)
        filebd.createFile(file,originaltite,"PREWIEV-FILE",'prevx2_',ovner,uuid+"_prevx2","none",folder+"/"+"prevx2_"+file,"")
    if extension == ".mp4" or extension == ".MP4" or extension == ".mov" or  extension == ".MOV":
        print("MMMPPP$$$")
        os.system("python3 videoprev.py "+folder+"/"+file+" &")
        basename, extension = os.path.splitext(file)
        filebd.createFile(file,originaltite,"PREWIEV-FILE",'open_cv',ovner,uuid+"_open_cv","none",folder+"/"+basename+"-opencv/frame.jpg","")


def chekrezalution(folder,file):
    vid = cv2.VideoCapture(folder+file)
    height = vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
    width = vid.get(cv2.CAP_PROP_FRAME_WIDTH)
    if height > 1080:
        return "vertical"
    else:
        return "horizontal"
    if width > 1920:
        return "vertical"
    else:
        return "horizontal"
    return False


if __name__ == "__main__":
    import sys
    if sys.argv[1] == "--file":
        createpervfile(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6])
        sys.exit(1)
    sys.exit(1)
