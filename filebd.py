from peewee import *
import hashlib
from datetime import datetime, timedelta, timezone
import os
import json
import jwt
import uuid


path = os.path.abspath(os.curdir)+"/config/"


db = SqliteDatabase(path+'storeg.db')




class Folder(Model):
    name = TextField()
    uuid = TextField()
    ovner = TextField()
    puuid = TextField()

    class Meta:
        database = db

class File(Model):
    title = TextField()
    origintitle = TextField()
    description = TextField()
    types = TextField()
    ovner = TextField()
    uuid = TextField()
    puuid = TextField()
    dest = TextField()
    shared = TextField()
    size = FloatField()

    class Meta:
        database = db

   

def createFolder(name,uuid,puuid,ovner):
    folder = Folder.create(name=name,uuid=uuid,puuid=puuid,ovner=ovner)
    return True

def createFile(title,origintitle,description,types,ovner,uuid,puuid,dest,shared):
    fl = File.select().where((File.uuid == uuid),(File.ovner == ovner))
    if fl.exists():
        return False
    files = File.create(title=title,description=description,types=types,ovner=ovner,uuid=uuid,puuid=puuid,dest=dest,origintitle=origintitle,shared=shared,size=0)
    return True

def changeFileSize(uuid,size):
    try:
        fl = File.get((File.uuid == uuid))
        fl.size = size
        fl.save()
        return True
    except Exception:
        return False
#1000000
def existfolder(uuid,ovner):
    try:
        fl = Folder.get((Folder.uuid == uuid),(Folder.ovner == ovner))
        return True
    except Exception:
        return False


def getFolders(uuid,ovner):
    try:
        fl = Folder.get((Folder.uuid == uuid),(Folder.ovner == ovner))
        folders = {"name":fl.name,"uuid":fl.uuid,"puid":fl.puuid}
        return folders
    except Exception:
        fl = Folder.get((Folder.uuid == getUuidUserHome(ovner)),(Folder.ovner == ovner))
        folders = {"name":fl.name,"uuid":fl.uuid,"puid":fl.puuid}
        return folders

def getUuidUserHome(user):
    fl = Folder.get((Folder.puuid == "0000"),(Folder.ovner == user))
    return fl.uuid

def getUuidFolders(name):
    for folder in Folder.select().where(Folder.name == name):
        return folder.uuid
            
def puuid(uuid):
    for puuid in Folder.select().where(Folder.uuid == uuid):
        return puuid.puuid

def getFileInfo(uuid,ovner):
    try:
        fl = File.get((File.uuid == uuid),(File.ovner == ovner))
        return fl
    except Exception:
        return False



def getListFile(uuid,ovner):
    FileList = []
    for file in File.select().where((File.puuid == uuid),(File.ovner == ovner)):
        Files = {"name":file.origintitle,"description":file.description,"ovner":file.ovner,"uuid":file.uuid,"type":file.types,"size":file.size}
        if Files['type'] == 'prevx2_' or Files['type'] == 'prev_':
            continue
        FileList.append(Files)
    return FileList

def getListFolder(uuid,ovner):
    FolderList = []
    for folder in Folder.select().where((Folder.puuid == uuid),(Folder.ovner == ovner)):    
        Folders = {"name":folder.name,"uuid":folder.uuid,"ovner":folder.ovner}
        FolderList.append(Folders)
    return FolderList

def getFile(uuid,ovner):
    FileList = {"File":[]}
    for file in File.select().where(File.uuid == uuid):
        Files = {"title":file.title,"description":file.description,"ovner":file.ovner,"uuid":file.uuid}
        FileList["File"].append(Files)
    return FileList

def getFileOrogonTitile(uuid,ovner):
    try:
        fl = File.get((File.uuid == uuid),(File.ovner == ovner))
        return fl.origintitle
    except Exception:
        return False


def getFileTitle(title,ovner):
    FileList = {"File":[]}
    for File in File.select().where((File.title == title),(File.ovner == ovner)):
        Files = {"title":File.title,"description":File.description,"ovner":File.ovner,"uuid":File.uuid}
        FileList["File"].append(Files)
    return FileList

def getFileDest(uuid,ovner):
    try:
        fl = File.get((File.uuid == uuid),(File.ovner == ovner))
        return fl.dest
    except Exception:
        return False

def getFileDel(uuid,ovner):
    try:
        fl = File.get((File.uuid == uuid),(File.ovner == ovner))
        name = fl.dest
        fl.delete_instance()
        return name
    except Exception:
        return False


def getFolderDel(uuid,ovner):
    if puuid(uuid) == "0000":
        return False
    directory = Folder.get(Folder.uuid == uuid)
    directory.delete_instance()
    children = Folder.select().where(Folder.puuid == uuid)
    for child in children:
        getFolderDel(child.uuid,ovner)
    files = File.select().where((File.puuid == uuid))
    for file in files:
        try:
            fl = getFileDel(file.uuid,ovner)
            fl_prev = getFileDel(file.uuid,ovner)
            fl_prevx2 = getFileDel(file.uuid,ovner)
            fl_opencv = getFileDel(file.uuid,ovner)
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
        except Exception as e:
            a = 0
    return True

def getSharedFile(uuid):
    try:
        query = File.select().where(File.uuid == uuid)
        if query.exists():
            fl = File.get(File.uuid == uuid)
            return fl.shared
    except Exception:
        return False

def getsharedFile(uuid):
    try:
        fl = File.get((File.uuid == uuid))
        return fl.dest
    except Exception:
        return False


def collectFileList(uuid,ovner):
    if existfolder(uuid,ovner) == True:    
        filesjson = {
            "folder": getFolders(uuid,ovner),
            "folder_back": getFolders(puuid(uuid),ovner),
            "files": getListFile(uuid,ovner),
            "folderin": getListFolder(uuid,ovner)
            }
    else:
        filesjson = {
            "folder": getFolders(uuid,ovner),
            "folder_back": getFolders(puuid(uuid),ovner),
            "files": getListFile(getUuidUserHome(ovner),ovner),
            "folderin": getListFolder(getUuidUserHome(ovner),ovner)
            }
    return filesjson

def InitializationDB():
    File.create_table()
    Folder.create_table()
    user = ["STOREG"]
    for us in user:
        try:
            a = Folder.get((Folder.ovner == us),(Folder.name == "home"))
        except Exception:
            createFolder("home",uuid.uuid4(),"0000",us)

InitializationDB() 