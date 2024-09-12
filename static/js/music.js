let treck; // Переменная с индексом трека
var dirlistopen = 0
var curentfolderplaylist ;
var trackcurrent;


window.addEventListener('load', () => {
    treck = 0;
    let audio = document.getElementById("players");    // Берём элемент audio
    let time = document.querySelector(".time");      // Берём аудио дорожку
    let btnPlay = document.querySelector(".play");   // Берём кнопку проигрывания
    let btnPause = document.querySelector(".pause"); // Берём кнопку паузы
    let btnPrev = document.querySelector(".prev");   // Берём кнопку переключения предыдущего трека
    let btnNext = document.querySelector(".next");   // Берём кнопку переключение следующего трека
    
    
  });

// Массив с названиями песен
var playlist = [];
 

 
// Событие перед загрузкой страницы


function switchTreck (numTreck) {
    
    let audio = document.getElementById("players");
    document.getElementsByClassName("nametrack")[0].innerHTML = playlist[numTreck].name
    
    // Меняем значение атрибута src
    console.log(audio.src)
    console.log(undef)
    var undef = "/storeg/file/get?uuid="+playlist[numTreck].uuid;
    console.log(undef)
    if (undef.includes("undefined") == true){}else{
    audio.src = "/storeg/file/get?uuid="+playlist[numTreck].uuid;
    
    
    //loadFile('/music:?file=' +curentfolderplaylist+"/"+ playlist[numTreck])
    // Назначаем время песни ноль
    audio.currentTime = 0;
    // Включаем песню
    audio.play();
    setid('panelms').innerHTML = playlist[numTreck].name
    if (music_prew == 1){
    ID3.loadTags(audio.src, function() {
      showTags(audio.src);
    }, {
      tags: ["picture"]
    });}
  }
  
}


function showTags(url) {
  if (url.includes("undefined") == true){}else{
  var tags = ID3.getAllTags(url);
  console.log(tags);
  var image = tags.picture;
  if (image) {
    var base64String = "";
    for (var i = 0; i < image.data.length; i++) {
        base64String += String.fromCharCode(image.data[i]);
    }
    var base64 = "data:" + image.format + ";base64," +
            window.btoa(base64String);
    document.getElementById('picture').setAttribute('src',base64);
  } else {
    defaultimg()
  }
}
}


function nexttime(){
  auPause()
  let audio = document.getElementById("players");
  audio.currentTime = document.getElementById("time").value;
  audio.currentTime = document.getElementById("time").value;
  auPlay()
}

function openmenu(){
  updateURL("menupanel")
  document.getElementsByClassName('vis')[0].classList.remove("unvis")
  document.getElementsByClassName('pl')[0].classList.add("unvis")
  document.getElementsByClassName('playlist')[0].classList.add("unvis")
  document.getElementsByClassName('uploadtrack')[0].classList.add("unvis")
  document.getElementsByClassName('uploadtrackyoutube')[0].classList.add("unvis")
  document.getElementsByClassName('createfolder')[0].classList.add("unvis")
}

function auPlay() {
    let audio = document.getElementById("players");
    let time = document.getElementById("time");
    audio.play(); // Запуск песни
    
    // Запуск интервала 
    audioPlay = setInterval(function() {
        // Получаем значение на какой секунде песня
        let audioTime = Math.round(audio.currentTime);
        // Получаем всё время песни
        let audioLength = Math.round(audio.duration)
        // Назначаем ширину элементу time
        //time.min = 0
        //time.max = 100
        time.setAttribute('max', audioLength)
        //time.setAttribute('value', (audioTime * 100) / audioLength + '%')
        //time.value = (audioTime * 100) / audioLength + '%';
        time.value = audioTime
        // Сравниваем, на какой секунде сейчас трек и всего сколько времени длится
        // И проверяем что переменная treck меньше четырёх
        if (audioTime == audioLength && trackcurrent < playlist.length) {
          trackcurrent++; // То Увеличиваем переменную 
          
            switchTreck(trackcurrent); // Меняем трек
        // Иначе проверяем тоже самое, но переменная treck больше или равна четырём
        } else if (audioTime == audioLength && trackcurrent >= playlist.length) {
          console.log("end playlist")
          if (music_repeat == 0){auPause(); return "stop"}
          trackcurrent = 0; // То присваиваем treck ноль
          
          if (music_repeat == 1){switchTreck(trackcurrent)}
            //Меняем трек
           
        }
    }, 10)

    document.getElementsByClassName('btn-play')[0].classList.add("unvis")
    document.getElementsByClassName('btn-pause')[0].classList.remove("unvis")
    
}

function auPause() {
    let audio = document.getElementById("players");
    audio.pause(); // Останавливает песню
    clearInterval(audioPlay) // Останавливает интервал
    document.getElementsByClassName('btn-play')[0].classList.remove("unvis")
    document.getElementsByClassName('btn-pause')[0].classList.add("unvis")
}

function auPrew() {
  trackcurrent = trackcurrent - 1
  switchTreck(trackcurrent);
  if (trackcurrent <= -1){
    trackcurrent = playlist.length
    auPrew()
  }
  
  //trackcurrent = trackcurrent - 1
  //switchTreck(trackcurrent);
  //if (trackcurrent < 0)
  //{trackcurrent = playlist.length-1
  //auPrew()}
  document.getElementsByClassName('btn-play')[0].classList.remove("unvis")
  document.getElementsByClassName('btn-pause')[0].classList.add("unvis")
}


function auNext() {
  trackcurrent = trackcurrent + 1
  switchTreck(trackcurrent);
  if (trackcurrent >= playlist.length)
  {trackcurrent = -1
  auNext()}
  
}




function opendirlist(){
  updateURL("playlist")
      document.getElementsByTagName("vis")[0].classList.add("unvis")
      document.getElementsByTagName("playlist")[0].classList.remove("unvis")
      //document.getElementsByClassName("toppaneltext")[0].innerHTML = "Хранилка"
      if (dirlistopen < 1){
          json = JSON.parse(listdir);
          var itemadd;    
          dirlistopen = dirlistopen +1
        for (itemadd = 0; itemadd < foldercount; itemadd++) {
          createlistfolder(json["folder"][itemadd],itemadd);
          //createlistfolderupload(json["folder"][itemadd],itemadd);
        }
      }
  }
  


    function getlistfile(path) {
      updateURL("tracks")
      showplaylist()
      document.getElementsByClassName('PLaylistName')[0].innerHTML = path
      if (document.getElementsByClassName('PLaylistName')[0].innerHTML == "!allfolders!") {document.getElementsByClassName('btnuploadmusic')[0].classList.add("unvis")
      document.getElementsByClassName('btnuploadmusicyo')[0].classList.add("unvis")}
      else {document.getElementsByClassName('btnuploadmusic')[0].classList.remove("unvis")
      document.getElementsByClassName('btnuploadmusicyo')[0].classList.remove("unvis")}
      document.getElementById('folderinput').value = path
      document.getElementById('folderinputyoutube').value = path
      document.getElementsByClassName('vis')[0].classList.add("unvis")
      document.getElementsByClassName('pl')[0].classList.remove("unvis")
      document.getElementsByClassName('playlist')[0].classList.add("unvis")
      var photolists = document.getElementsByClassName('trackcolag')[0]
      var parent = photolists.parentNode
      parent.removeChild(photolists)

      var question = document.getElementsByClassName("pretrackcolag");
      var q = document.createElement("trackcolag");
      q.setAttribute("class", "trackcolag");
      q.setAttribute("style", "display:inline-flex;flex-wrap:wrap; height : 100%;overflow-y: scroll;")
      for (var i = 0; i < question.length; i++) {
       question[i].appendChild(q);
      }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + access_token);
        myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "folder": path
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      fetch("/getlistfilemusic", requestOptions)
        .then(response => response.text())
        .then(result => showphoto(result,path))
        .catch(error => alert(error));
      
      }
      function showphoto(result,folder) {
        if (folder == "!allfolders!"){folder = ""}
        curentfolderplaylist = folder;
        playlist = [];
        json = JSON.parse(result);
        filelist = json
        //alert(json["file"].indexOf('prev_heic_IMG_1294.png'));
      
        var itemadd;
        for (itemadd = 0; itemadd < json["count"]; itemadd++) {
          creatfhotolist(json["file"][itemadd],folder,itemadd)
        }  
      
      }
    
      function creatfhotolist(track,folder,ids) {
        var question = document.getElementsByClassName("trackcolag");
        playlist.push(track);
        var q = document.createElement("div");
        ids++;
        q.setAttribute("class", "border border-primary rounded")
        q.setAttribute("style", "height: 30px; width: 100%;margin: 2px;overflow: hidden;margin-top: 5px;")
        q.setAttribute("onclick", "loadtrack('"+folder+"','"+track+"')")
        q.innerText = track
      

      
        //var q2 = document.createElement("img");
        //q2.setAttribute("class", "rounded");
        //q2.setAttribute("height", "25px");
        //q2.setAttribute("width", "25px");
        //q2.setAttribute("src", "/music:?file="+folder+"/"+photo)
        
        //q.appendChild(q2)
      
        for (var i = 0; i < question.length; i++) {
          question[i].appendChild(q);
        }    

      }

  function loadtrack(curentfolderplaylist,track){
    if (track == "undefined"){}
    else{
    document.getElementsByClassName('prewplayer')[0].classList.remove("unvis")
    document.getElementsByClassName('listtrack')[0].classList.add("unvis")
    document.getElementsByClassName('loadtrck')[0].classList.add("unvis")
    
    let audio = document.getElementById("players");
    let time = document.getElementById("time");
    audio.src = audio.src = '/music:?file=' +curentfolderplaylist+"/"+ track;
    //loadFile(audio.file,audio.src)
    if (music_prew == 1){
    ID3.loadTags(audio.src, function() {
      showTags(audio.src);
    }, {
      tags: ["picture"]
    });}


    document.getElementsByClassName("nametrack")[0].innerHTML = track
    trackcurrent = playlist.indexOf(track);
    //switchTreck(playlist.indexOf(track))
    auPlay()
  }
  }

  function showplaylist(){
    document.getElementsByClassName('prewplayer')[0].classList.add("unvis")
    document.getElementsByClassName('listtrack')[0].classList.remove("unvis")
    document.getElementsByClassName('loadtrck')[0].classList.remove("unvis")
  }

  function showplayer(){
    document.getElementsByClassName('prewplayer')[0].classList.remove("unvis")
    document.getElementsByClassName('listtrack')[0].classList.add("unvis")
    document.getElementsByClassName('loadtrck')[0].classList.add("unvis")
  }
  
  function defaultimg(){
    document.getElementById('picture').setAttribute('src',"/static/img/v4/music.svg");
  }

  function updateURL(pref) {
    if (history.pushState) {
        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var newUrl = baseUrl + "#"+pref;
        history.pushState(null, null, newUrl);
    }
    else {
        console.warn('History API не поддерживается');
    }
    //alert(window.location)
}


addEventListener("popstate",function(e){
  var s = window.location
  var urlsp = String(s).split('#').pop()
  if (urlsp == "playlist"){opendirlist()}
  if (urlsp == "menupanel"){openmenu()}
  if (urlsp == "tracks"){getlistfile('!allfolders!')}
  
  
},false);





function shuffle(array) {
  array.sort(() => Math.random() - 0.1);
}

function shuffleplaylist(){
  shuffle(playlist);
  auNext()
}