function setid(id){return document.getElementById(id)}
function setclass(id){return document.getElementsByClassName(id)}

function ShowMessage(message,title,type){
    if (type == "error"){setid('labelmessage').setAttribute("style","color:red;")}
    if (type == "message"){setid('labelmessage').setAttribute("style","color:white;")}
    if (type == "hint"){setid('labelmessage').setAttribute("style","color: #FFEBB2;")}
  setid('labelmessage').innerHTML = title
  setid('textmessage').innerHTML = message
  $('#alertmodal').modal('show')
}

function loader(){
  setid('loader').classList.toggle("unvis")
  setid("body-content").classList.toggle("unvis")
}

function updateURLFull(prefs) {
  let pref = prefs
  if (username == "SHARED"){pref = pref +"&shared=all"}
  if (history.pushState) {
    var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    var newUrl = baseUrl + "?"+pref;
    history.pushState(null, null, newUrl);
  }
  else {
      console.warn('History API не поддерживается');
  }
  //alert(window.location)
}
