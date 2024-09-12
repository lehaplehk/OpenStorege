# -*- coding: utf-8 -*-
from flask import Flask
from flask import request, jsonify, send_file
from flask import render_template, request, redirect, url_for, flash, make_response, session
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime, timedelta, timezone
import requests
import time
import datetime
import random
import hashlib
from urllib.request import urlretrieve
from pathlib import Path
import filebd
import uuid
from zipfile import ZipFile

chekmode = True
#123


app = Flask(__name__)
CORS(app)
web_key = open(os.path.abspath(os.curdir)+"/config/web.key", 'r')
app.secret_key = str(web_key)

path = os.path.abspath(os.curdir)+"/config/"
pathstoreg = "storeg/" #os.path.abspath(os.curdir)+"/storeg/"
pathmusic = os.path.abspath(os.curdir)+"/storeg/music/"
Conf = open(path+"serv.conf", 'r')
Conf = json.load(Conf)


def ErorLog(message):
    if os.path.exists("error.log") == False:
        f = open("error.log","w")
    else:
        f = open("error.log","r+")
    f.write("\n"+str(message))
    f.close()

@app.errorhandler(404)
def er404(error):
    return render_template('error/404.html'), 404

@app.errorhandler(500)
def er505(error):
    return render_template('error/500.html'), 500

@app.errorhandler(400)
def er400(error):
    return render_template('error/400.html'), 400


@app.route('/')
def home():
    return render_template("loading.html")

@app.route('/storeg')
def storeg():
    req = request.args
    if not "folder" in req:
        link_folder = filebd.getUuidUserHome("STOREG")
    else:
        link_folder = req['folder']
    if not "file" in req:
        link_file = "none"
    else:
        link_file = req['file']      
    return render_template("storeg.html",
        username = "STOREG",
        link_folder = link_folder,
        link_file = link_file)
    return redirect(url_for("signin"))

@app.route('/storeg/content/get')
def storeg_content_get():
    #try:
    req = request.args
    if not "folder" in req:
        return "No req"
    return filebd.collectFileList(req['folder'],"STOREG")
    #except Exception as error:
    #    ErorLog(error)

@app.route('/storeg/file/get')
def storeg_file_get():
    #try:
    req = request.args
    if not "uuid" in req:
        return "No req"
    return send_file(filebd.getFileDest(req['uuid'],"STOREG"),download_name=filebd.getFileOrogonTitile(req['uuid'],"STOREG"))

@app.route('/storeg/file/info')
def storeg_file_info():
    #try:
    req = request.args
    if not "uuid" in req:
        return "No req"
    file = filebd.getFileInfo(req['uuid'],"STOREG")
    info = {"origintitle":file.origintitle,"puuid":file.puuid,"uuid":file.uuid,"size":file.size}
    return info
    #except Exception as error:
    #    ErorLog(error)

@app.route('/storeg/file/zip/structure')
def storeg_file_zip():
    #try:
    req = request.args
    if not "uuid" in req:
        return "No req"
    a = ""
    file = filebd.getFileInfo(req['uuid'],"STOREG")
    try:
        with ZipFile(file.dest) as myzip:
            for name in myzip.namelist():
                items = name.rstrip("/").split("/")
                #print("  "*(len(items)-1) + items[-1])
                #a = "  "*(len(items)-1) + items[-1]
                a = a + "       "*(len(items)-1) + items[-1]+"\n"
    except Exception:
        return "none"
    return a
    #except Exception as error:
    #    ErorLog(error)

@app.route('/storeg/file/createfolder')
def storeg_file_createfolder():
    req = request.args
    if not "folder" in req:
        return "No req" 
    filebd.createFolder(req['folder'],uuid.uuid4(),req['curent'],"STOREG")
    return "Директория создана",200

@app.route('/storeg/file/del')
def storeg_file_del():
    #try:
    req = request.args
    if not "uuid" in req:
        return "No req"
    if 'folder' in req:
        if filebd.getFolderDel(req['folder'],"STOREG") == True:
            return "Успешно",200
        else:
            return "Директории не найдено",200
    fl = filebd.getFileDel(req['uuid'],"STOREG")
    fl_prev = filebd.getFileDel(req['uuid']+"_prev","STOREG")
    fl_prevx2 = filebd.getFileDel(req['uuid']+"_prevx2","STOREG")
    fl_opencv = filebd.getFileDel(req['uuid']+"_open_cv","STOREG")
    if not fl == False:
        os.remove(fl)
        if not fl_prev == False:
            if os.path.exists(fl_prev) == True:
                os.remove(fl_prev)
        if not fl_prevx2 == False:
            if os.path.exists(fl_prevx2) == True:
                os.remove(fl_prevx2)
        if not fl_opencv == False:
            if os.path.exists(fl_opencv) == True:
                os.remove(fl_opencv)
        return "Успешно",200
    return "Файла не найдено",200
    #except Exception as error:
    #    ErorLog(error)


@app.post("/storeg/file/upload2")
def upload_chunk():
    file = request.files["file"]
    file_uuid = request.form["dzuuid"]
    folder = request.form.get('folder')
    filename = f"{secure_filename(file.filename)}"
    names = file.filename
    basename, extension = os.path.splitext(filename)
    filename_uuid = str(file_uuid)+str(extension)
    hex_string = hashlib.md5(filename_uuid.encode("UTF-8")).hexdigest()+extension
    save_path = Path(pathstoreg, "STOREG"+"/", hex_string)
    current_chunk = int(request.form["dzchunkindex"])
    filebd.createFile(filename_uuid,file.filename,"File upload : "+str(datetime.datetime.now()),extension,"STOREG",file_uuid,folder,save_path,"")
    try:
        with open(save_path, "ab") as f:
            f.seek(int(request.form["dzchunkbyteoffset"]))
            f.write(file.stream.read())
    except OSError:
        return "Error saving file.", 500

    total_chunks = int(request.form["dztotalchunkcount"])
    if current_chunk + 1 == total_chunks:
        if os.path.getsize(save_path) != int(request.form["dztotalfilesize"]):
            return "Size mismatch.", 500
    if current_chunk == total_chunks-1:
        filebd.changeFileSize(file_uuid,float("{0:.4f}".format(os.path.getsize(save_path)/1e+6)))
        os.system("python3 preview.py --file "+hex_string+" "+"storeg/"+"STOREG"+" "+file_uuid+" "+"STOREG"+" "+file.filename)
    return "Chunk upload successful.", 200

def Genkey(name):
    gen = str(random.randint(8687685465675, 
    989898565675467324578789789))+str(random.randint(8687685465675, 
    989898219323478453177459789))+str(random.randint(8687685465675, 
    981231549309023747862389789))
    gen = bytes(gen, 'utf-8')
    gen = hashlib.sha256(gen).hexdigest()
    f = open(path+name, 'w')
    f.write(gen)
    f.close()


if __name__ == "__main__":
    import sys
    if sys.argv[1] == "--start":
        app.run(host=Conf["ip"], port=Conf['portweb'])