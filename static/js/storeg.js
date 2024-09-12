
//TRASH
var curentfolder;
var startTime; 
let event = null;
var musicactive = 0;
var curentplaylist;
var curentfolderplaylist;
var slicefolder;
var selectmode = 0;
var selectfile = [];
var music_repeat = 1;
var music_prew = 1;
//
let puuid_ ;
var sh_link = ""
document.oncontextmenu = function() {return false;};
window.addEventListener('load', () => {
    updateURLFull("folder="+link_folder+"&file="+link_file)
    if (link_folder != ""){GetContentList(link_folder)}else{GetContentList("")}
    if (link_file != "none"){GetFileInfo(link_file);}
});


function CreateContentList(cont){
    json = JSON.parse(cont)
    curentplaylist = []
    for (itemadd = 0; itemadd < json.files.length; itemadd++){
        if (json.files[itemadd].type == ".mp3"){curentplaylist.push(json.files[itemadd])}
    }
    setid('folder_input_path').value = json.folder.name
    curentfolder = json.folder.uuid
    if (json["status"] == 404){ShowMessage(json["error"],json["status"],"error");return "error"}
    setid('content-list').remove();
    var question = document.getElementsByClassName("content-list-parent");
    var q = document.createElement("div");
    q.setAttribute("class", "content-list slide-in-fwd-center")
    q.setAttribute("id", "content-list")
    for (var i = 0; i < question.length; i++) {question[i].appendChild(q);}

    if (setid('folder_input_path').value == 'home'){}else{CreateItem(json.folder_back.name,"back",json.folder_back.uuid,0)}
    
     

    for (itemadd = 0; itemadd < json.folderin.length; itemadd++) {
        CreateItem(json.folderin[itemadd].name,"folder",json.folderin[itemadd].uuid,0)
    }
    for (itemadd = 0; itemadd < json.files.length; itemadd++) {
        CreateItem(json.files[itemadd].name,"file",json.files[itemadd].uuid,json.files[itemadd].size)
    }
    function CreateItem(name,type,uuid,size){
    var question = document.getElementsByClassName("content-list");
    
    var q = document.createElement("div");
    q.setAttribute("class"," st-item ")//GetContentList(setid('folder_input_path').value+"+"/'"+name+"')
    

    if(type == "folder"){q.setAttribute("onclick","GetContentList('"+uuid+"')")}
    if(type == "back"){q.setAttribute("onclick","GetContentList('"+uuid+"')")}
    //
    var q2 = document.createElement("div");
    q2.setAttribute("class","d-flex flex-column")
    q.appendChild(q2)

    var q3 = document.createElement("div");
    q3.setAttribute("class","d-flex flex-column")
    q2.appendChild(q3)

    var q2 = document.createElement("div");
    q2.setAttribute("id",uuid)
    //q2.setAttribute("id","items-"+itemadd)//https://storeges.site/static/img/v3/folder.svg
    if(type == "folder"){q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/folder.svg') center center/contain no-repeat content-box;")}
    if(type == "back"){q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/dots.svg') center center/contain no-repeat content-box;")}
    if(type == "file"){
        if (ChekContent(name) == "none"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/none.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','none','"+uuid+"',"+size+")")}
        if (ChekContent(name) == "textfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/file.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','textfile','"+uuid+sh_link+"',"+size+")")}
        if (ChekContent(name) == "imgfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/storeg/file/get?uuid="+uuid+"_prev"+sh_link+"') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','imgfile','"+uuid+sh_link+"',"+size+")")}
        if (ChekContent(name) == "pdffile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/pdf.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','pdffile','"+uuid+sh_link+"',"+size+")")}
        if (ChekContent(name) == "archivefile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/archive.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','archivefile','"+uuid+sh_link+"',"+size+")")}
        if (ChekContent(name) == "musicfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/music.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name.replace("'","")+"','musicfile','"+uuid+sh_link+"',"+size+")")}
        if (ChekContent(name) == "htmlfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/html.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','htmlfile','"+uuid+sh_link+"',"+size+")")}
        if (ChekContent(name) == "isofile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/iso.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','isofile','"+uuid+sh_link+"',"+size+")")} 
        if (ChekContent(name) == "appfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/app.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','appfile','"+uuid+sh_link+"',"+size+")")}  
        if (ChekContent(name) == "linkfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/lnk.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','linkfile','"+uuid+sh_link+"',"+size+")")}    
        if (ChekContent(name) == "shfile"){
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/static/img/v4/sh.svg') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','shfile','"+uuid+sh_link+"',"+size+")")} 
        if (ChekContent(name) == "videofile"){
            fl = name.replace(".mp4","");
            fl = fl.replace(".MP4","");
            fl = fl.replace(".mov","");
            fl = fl.replace(".MOV","")
            q2.setAttribute("style","margin: auto; width: 50px; height: 50px; background: url('/storeg/file/get?uuid="+uuid+"_open_cv') center center/contain no-repeat content-box;")
            q2.setAttribute("onclick","ShowContent('"+setid('folder_input_path').value+"','"+name+"','videofile','"+uuid+","+size+"')")} 
    }
    
    

    q3.appendChild(q2)

    var q2 = document.createElement("div");
    q2.setAttribute("class","position-relative text-center")
    q2.setAttribute("style","font-size: 10px; bottom: 2px; max-width: 60px;max-height:15px;overflow: hidden;")
    if (name == "#none"){}else{q2.innerHTML = name}
    
    q3.appendChild(q2)
    
    for (var i = 0; i < question.length; i++) {question[i].appendChild(q);}
    }

}



function GetContentList(folder){
    Loading()
    updateURLFull("folder="+folder)
    setid('folderinput').value = setid('folder_input_path').value
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  
  fetch("storeg/content/get?folder="+folder+""+sh_link, requestOptions)
    .then(response => response.text())
    .then(result => CreateContentList(result))
    .catch(error => console.log(error));
    
Loading()
}

function GetZipStructure(uuid){
    Loading()
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  
  fetch("/storeg/file/zip/structure?uuid="+uuid)
    .then(response => response.text())
    .then(result => chek(result))
    .catch(error => console.log(error));
    
    function chek(res){if (res == "none"){setid('modalTexArea').classList.add('unvis')
        setid('contentimg').classList.remove('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('pdf-viewer').classList.add('unvis')
        setid('contentimg').src = "/static/img/v4/"+retursvg("archivefile")}else{setid('modalTexArea').value = res}}
Loading()
}

function GetFileInfo(uuid){
    Loading()
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  
  fetch("/storeg/file/info?uuid="+uuid+""+sh_link, requestOptions)
    .then(response => response.text())
    .then(result => rt(result))
    .catch(error => console.log(error));
    function rt(ls){ls = JSON.parse(ls);ShowContent(setid('folder_input_path').value,ls.origintitle,ChekContent(ls.origintitle),ls.uuid+sh_link,ls.size)}
Loading()
}

function ChekContent(name){
if(name.includes(".txt") == true | name.includes(".js") |
    name.includes(".css") | name.includes(".ini") | name.includes(".py") |
    name.includes(".md")  == true)
    {return "textfile"}
if(name.includes(".jpg") == true | name.includes(".jpeg") |
    name.includes(".png") | name.includes(".PNG") | name.includes(".JPEG") |
    name.includes(".JPG")  == true)
    {return "imgfile"}
if(name.includes(".zip") == true | name.includes(".rar") |
    name.includes(".gz") == true)
    {return "archivefile"}
if(name.includes(".mp4") == true | name.includes(".MP4") | name.includes(".mov") | name.includes(".MOV") | name.includes(".3gp") | name.includes(".avi") == true)
    {return "videofile"}
if(name.includes(".mp3") == true | name.includes(".wav") == true){return "musicfile"}
if(name.includes(".pdf") == true ){return "pdffile"}
if(name.includes(".html") == true ){return "htmlfile"}
if(name.includes(".iso") == true ){return "isofile"}
if(name.includes(".exe") == true | name.includes(".appimage") | name.includes(".app") == true){return "appfile"}
if(name.includes(".lnk") == true ){return "linkfile"}
if(name.includes(".sh") == true | name.includes(".cmd") | name.includes(".bat") == true){return "shfile"}

return "none"
}

function retursvg(svg){
    if (svg == "isofile"){return "iso.svg"}
    if (svg == "appfile"){return "app.svg"}
    if (svg == "shfile"){return "sh.svg"}
    if (svg == "archivefile"){return "archive.svg"}
    if (svg == "none"){return "none.svg"}
    
}
//['textfile','imgfile','archivefile','musicfile','pdffile','htmlfile','isofile','appfile','linkfile','shfile']
function ShowContent(folder,name,type,uuid,size){
    Loading()
    PauseMedia()
    updateURLFull("folder="+curentfolder+"&file="+uuid)
    if (type == "imgfile"){
        setid('modalTexArea').classList.add('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('contentimg').classList.remove('unvis')
        setid('pdf-viewer').classList.add('unvis')
        setid('contentimg').src = "/storeg/file/get?uuid="+uuid}
    if (type == "videofile"){
        setid('modalTexArea').classList.add('unvis')
        setid('modalMedia').classList.remove("unvis")
        setid('contentimg').classList.add('unvis')
        setid('pdf-viewer').classList.add('unvis')
        setid('modalMedia').src = "/storeg/file/get?uuid="+uuid}
    if (type == "textfile" | type == "htmlfile" ){
        setid('contentimg').classList.add('unvis')
        setid('modalTexArea').classList.remove('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('pdf-viewer').classList.add('unvis')
        LoadTextFile("/storeg/file/get?uuid="+uuid)}
    if (type == "archivefile"){
        setid('contentimg').classList.add('unvis')
        setid('modalTexArea').classList.remove('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('pdf-viewer').classList.add('unvis')
        GetZipStructure(uuid)}
    if (type == "isofile" | type == "appfile" | type == "shfile"){
        setid('modalTexArea').classList.add('unvis')
        setid('contentimg').classList.remove('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('pdf-viewer').classList.add('unvis')
        setid('contentimg').src = "/static/img/v4/"+retursvg(type)}
    if (type == "linkfile"){LoadLinkFile("/storeg/file/get?folder="+folder+"&file="+name); return "ok"}
    if (type == "pdffile" | type == "htmlfile" ){
        setid('contentimg').classList.add('unvis')
        setid('modalTexArea').classList.add('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('pdf-viewer').classList.remove('unvis')
        OpenPDF("/storeg/file/get?uuid="+uuid)}
    //
    if (type == "none" ){
        setid('modalTexArea').classList.add('unvis')
        setid('contentimg').classList.remove('unvis')
        setid('modalMedia').classList.add("unvis")
        setid('pdf-viewer').classList.add('unvis')
        setid('contentimg').src = "/static/img/v4/"+retursvg(type)}
    if (type == "musicfile"){
        playlist = curentplaylist 
        curentfolderplaylist = folder
        let audio = document.getElementById("players");
        let time = document.getElementById("time");
        audio.src = audio.src = "/storeg/file/get?uuid="+uuid
        
        if (music_prew == 1){
        ID3.loadTags(audio.src, function() {
        showTags(audio.src);
        }, {
        tags: ["picture"]
        });}
        setid('nametrack').innerHTML = name
        setid('panelms').innerHTML = name
        //document.getElementsByClassName("nametrack")[0].innerHTML = track
        trackcurrent = playlist.indexOf(name);
        auPlay()
        setid('btn_download_music').href = "/storeg/file/get?uuid="+uuid
        setid('btn_rm_file_music').setAttribute("onclick","showDelModal('"+name+"')")
    }
    //showDelModal(name)
    if (size > 1){setid('file_size').innerHTML = size+" MB"}else{setid('file_size').innerHTML = (size*1000).toFixed(2)+" KB"}
    setid('btn_download').href = "/storeg/file/get?uuid="+uuid
    setid('rm_btn_yes').setAttribute("onclick","rmfile('/storeg/file/del?uuid="+uuid+"')")
    setid('btn_rm_file').setAttribute("onclick","showDelModal('"+name+"')")
    setid('contentlabelmessage').innerHTML = name;
    if (type != "musicfile" ){$('#contentmodal').modal('show')}else{$('#ModalMusic').modal('show')}
    Loading()
 
}

function LoadTextFile(url){
    fetch(url+sh_link)
    .then(response => response.text())
    .then(data => {
        setid('modalTexArea').value = data;
    });
}

function LoadLinkFile(url){
    fetch(url+sh_link)
    .then(response => response.text())
    .then(data => { window.location  = data});
    Loading()
}

function mkrid(){
    fetch("/storeg/file/createfolder?folder="+setid('new_folde_name').value+"&curent="+curentfolder+sh_link)
    .then(response =>response.text())
    .then(result => ShowMessage(result,"",'message'));
    GetContentList(curentfolder)
}

function rmfile(url){
    fetch(url+sh_link)
    .then(response =>response.text())
    .then(result => ShowMessage(result,"",'message'));
    GetContentList(curentfolder)
}


function PauseMedia() { 
    let vid = setid("modalMedia");
    vid.pause(); 
} 


$(document).ready(function(){
    var shows = 0;
    $('[id^="items-"]').mousedown(function(){
      shows = setTimeout(function(){
        $('#shower').show();
      }, 1000);
  });
    
    $('[id^="items-"]').mouseup(function(){ 
       clearTimeout(shows);
     });
     $('*').not($('#shower')).mousedown(function(){
           $('#shower').hide();
    });
  
  });

function ShowDopMenu(){setid('dopmenu').classList.toggle('unvis')}

function showlistfile(){
    setid('folderinput').value = setid('folder_input_path').value
    inputfile = document.getElementById('fileuploadinput').files
  
    
  var parents = document.getElementsByClassName('listuploadfile-up')[0]
      var parent = parents.parentNode
      parent.removeChild(parents)
  
      var question = document.getElementsByClassName("listuploadfile");
      var q = document.createElement("div");
      q.setAttribute("class", "listuploadfile-up");
      for (var i = 0; i < question.length; i++) {
        question[i].appendChild(q);
      }
  
      for (var i = 0; i < inputfile.length; i++) {
        
        var question = document.getElementsByClassName("listuploadfile-up");
        var q = document.createElement("div");
        q.setAttribute("class", "");
        q.setAttribute("style","margin-left: 5px;")
        sizes = inputfile[i].size/1024/1024
        q.innerHTML = inputfile[i].name+" | "+ sizes.toFixed(2) + " MB"
        for (var is = 0; is < question.length; is++) {
          question[is].appendChild(q);
        }
    }
  
    //fileuploadinput
  }

function Loading(){
    setid('Loading').classList.toggle('unvis')    
}

function showDelModal(name){
    if (name == "!curentfolder!"){
        setid('rm_name').value = "Текущая директория"
        setid('rm_btn_yes').setAttribute("onclick","rmfile('/storeg/file/del?folder="+curentfolder+"&uuid=')")
    }else{setid('rm_name').value = name}
    
    $('#RMmodal').modal('show')
}

function OpenPDF(url){
    var canvas = document.getElementById('pdf-viewer');
  
    pdfjsLib.getDocument(url).promise.then(function(pdf) {
      pdf.getPage(1).then(function(page) {
        var viewport = page.getViewport({ scale: 1.0 });
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: context, viewport: viewport });
      });
    });
  }

  function CopyClipboar(text){
    navigator.clipboard.writeText(text)
    ShowMessage("Скопировано в буфер обмена: "+text,"Уведомление","hint")}

function musicstatus(){
    let audio = document.getElementById("players");
    if (!audio.paused) {musicactive = 1}else{musicactive}
    if (musicactive == 1){setid('panelms').classList.remove("unvis")}
    if (musicactive == 0){setid('panelms').classList.add("unvis")}
}

function OnPrewImgMusic(){
    music_prew = 0
    setid('btn-music-prev').setAttribute("src","static/img/v3/previmg2.svg")
    setid('btn-music-prev').setAttribute("onclick","OnPrewImgMusicall()")
}
function OnPrewImgMusicall(){
    music_prew = 1    
    setid('btn-music-prev').setAttribute("src","static/img/v3/previmg.svg")
    setid('btn-music-prev').setAttribute("onclick","OnPrewImgMusic()")
}