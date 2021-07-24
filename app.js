var games = [];
var orderColumn = "";
var selectedId = 0;

/***********************************
               API
************************************/

const API_KEY="RvtdXgBuU49Dz7zQQ5PM41t99AkRIWtE51PSaEna"
const API_URL = "https://nwvxwj1r24.execute-api.eu-central-1.amazonaws.com/dev/";
const API_LOGIN = API_URL+"login";
const API_SIGNUP = API_URL+"signup";
const API_CONFIRMSIGNUP = API_URL+"confirmsignup";
const API_GAMES = API_URL+"games";
const API_GAMES_BY_TITLE = API_URL+"sortedgames/title";
const API_GAMES_BY_PLAYERS = API_URL+"sortedgames/players";
const API_GAMES_BY_ID = API_URL+"sortedgames/id";

/* USERS */
function signup(event){
  console.log("signup");
  event.preventDefault();
  $.ajax({
    url: API_SIGNUP,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "password":$("input[id='password']").val()
    })
  }).done(function(resp){
    //$("div[id='msg']").text(resp.message);
    goTo('/confirmsignup');
  }).fail(function(msg){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Se ha producido un error");
  });
  return true;
}

function confirmSignup(){
  console.log("confirmsignup");
  event.preventDefault();
  $.ajax({
    url: API_CONFIRMSIGNUP,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "code":$("input[id='code']").val()
    })
  }).done(function(resp){
    $("div[id='msg']").text(resp.message);
  }).fail(function(msg){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Se ha producido un error");
  });
  return false;
}

function login(event){
  console.log("login");
  event.preventDefault();
  
  $.ajax({
    url: API_LOGIN,
    method: "POST",
    dataType : "json",
    headers:{
      "x-api-key": API_KEY
    },
    data: JSON.stringify({
      "username":$("input[id='username']").val(),
      "password":$("input[id='password']").val()
    })
  }).done(function(resp){
    localStorage.setItem('token', resp.token);
    goTo("/");
  }).fail(function(error){
    //$("div[id='msg']").text(JSON.parse(error.responseText).message);
    $("div[id='msg']").text("Credenciales incorrectas");
  });
  
  return false;
}

/* GAMES */

function getGames(){
  console.log("getGames");
  //event.preventDefault();
  var getUrl = "";
  if (orderColumn == "title")
  {
    getUrl = API_GAMES_BY_TITLE;
  }
  else if (orderColumn == "players")
  {
    getUrl = API_GAMES_BY_PLAYERS;
  }
  else if (orderColumn == "id")
  {
    getUrl = API_GAMES_BY_ID;
  }
  else
  {
    getUrl = API_GAMES;
  }
  $.ajax({
    url: getUrl,
    method: "GET",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    }
  }).done(function(resp){
    games=resp.items;
    goTo("/games");
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

function sortByTitle(){
  console.log("sortByTitle")
  orderColumn = "title";
  getGames();
}

function sortByPlayers(){
  console.log("sortByPlayers")
  orderColumn = "players";
  getGames();
}

function sortById(){
  console.log("sortById")
  orderColumn = "id";
  getGames();
}

function putGame(){
  console.log("putGame");
  event.preventDefault();
  
  $.ajax({
    url: API_GAMES,
    method: "PUT",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "id":$("input[id='id']").val(),
      "title":$("input[id='title']").val(),
      "players":$("input[id='players']").val(),
    })
  }).done(function(resp){
    getGames(); //actualizar listado de juegos
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  
  return false;
}

function deleteGame(event){
  console.log("deleteGame");
  event.preventDefault();
  id = $(this).attr('id').split("_")[1];
  console.log(id);
  $.ajax({
    url: API_GAMES,
    method: "DELETE",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "id":id
    })
  }).done(function(resp){
    getGames(); //actualizar listado de juegos
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  return false;
}

function postGame(event){
  console.log("modifyGame");
  event.preventDefault();
  $.ajax({
    url: API_GAMES,
    method: "POST",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    },
    data: JSON.stringify({
      "id":$("input[id='id']").val(),
      "title":$("input[id='title']").val(),
      "players":$("input[id='players']").val(),
    })
  }).done(function(resp){
    getGames(); //actualizar listado de juegos
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  return false;
}

/***********************************
      VISTAS Y RENDERIZACIÓN
************************************/
function loginPage(){
  content ='<h1>Login</h1><br/><div id="msg"></div><br/><form id="formLogin"><input type="text" name="username" placeholder="E-mail" id="username"><input type="password" name="password" id="password" placeholder="Contraseña"><button type="submit" value="Enviar" id="btnLogin">Enviar</button></form>';
  return content;
}

function signupPage(){
  content ='<h1>Registro</h1><br/><div id="msg"></div><br/><form id="formSignup"><input type="text" name="username" placeholder="E-mail" id="username"><input type="password" name="password" id="password" placeholder="Contraseña"><button type="submit" id="btnSignup">Enviar</button></form>';
  return content;
}
function confirmSignupPage(){
  content ='<h1>Confirmar e-mail</h1><br/><div id="msg"></div><br/><form id="formConfirmSignup"><input type="text" name="username" placeholder="E-mail" id="username"><input type="text" name="code" id="code" placeholder="Código"><button type="submit"  id="btnConfirmSignup">Enviar</button></form>';
  return content;
}

function  newGamePage(){
  content='<h1>Nuevo juego</h1><br/>';
  content+='<form id="formGame"><input type="text" name="id" placeholder="ID" id="id"><input type="text" name="title" id="title" placeholder="Título"><input type="text" name="players" id="players" placeholder="Min. Jugadores"><button type="submit" value="Enviar" id="btnNewGame">Enviar</button></form>';
  return content;
}

function  modifyGamePrepare(){
  content='<h1>Modificar juego</h1><br/>';
  var gameUrl = API_GAMES+"/"+selectedId;
  $.ajax({
    url: gameUrl,
    method: "GET",
    headers:{
      "x-api-key": API_KEY,
      "Authorization":"Bearer "+localStorage.getItem('token')
    }
  }).done(function(resp){
    games=resp.item;
    goTo('/modifygame');
  }).fail(function(error){
    //console.log(JSON.stringify(error));
    localStorage.removeItem('token');
    goTo("/");
  });
  return false;
}

function  modifyGamePage(){
  content='<h1>Modificar juego</h1><br/>';
  var id = games['id'];
  var title = games['title'];
  var players = games['players'];
  content+='<form id="formGame"><input type="text" name="id" value="' + id + '" id="id" disabled><input type="text" name="title" id="title" value="' + title + '"><input type="text" name="players" id="players" value="' + players + '"><button type="submit" value="Enviar" id="btnModifyGame">Enviar</button></form>';
  return content;
}

function gamesPage(){
  content='<h1>Juegos</h1><br/><button id="buttonSortByTitle">Ordenar por título</button><br/><br/><button id="buttonSortByPlayers">Ordenar por jugadores</button><br/><br/><button id="buttonSortById">Ordenar por ID</button><br/><br/><button id="linkNewGame">Nuevo juego</button><br/>';
  content+='<table border="1"><tr><th>ID</th><th>Título</th><th>Mínimo jugadores</th><th>Modificar</th><th>Eliminar</th></tr>';
  for (i = 0; i< games.length; i++){
    content+='<tr><td>'+games[i].id+'</td><td>'+games[i].title+'</td><td>'+games[i].players+'</td><td><button id="modify_'+games[i].id+'">...</button></td><td><button id="id_'+games[i].id+'">X</button></td></tr>';
  }
  content+='</table>'
  return content;
}

function renderApp() {
  /* MENÚ */
  var li_games = document.getElementById('li_games');
  var li_login = document.getElementById('li_login');
  var li_logout = document.getElementById('li_logout');
  var li_signup = document.getElementById('li_signup');
  if (localStorage.getItem('token')===null){
    li_games.style.display = 'none';
    li_logout.style.display = 'none';
    li_login.style.display = 'block';
    li_signup.style.display = 'block';
  }else{
    li_games.style.display = 'block';
    li_logout.style.display = 'block';
    li_login.style.display = 'none';
    li_signup.style.display = 'none';
  }

/* CARGAR VISTAS */
  var content;
  if (window.location.pathname === '/games') {
    content = gamesPage();
  } else if (window.location.pathname === '/newgame') {
    content = newGamePage();
  } else if (window.location.pathname === '/modifygame'){
    content = modifyGamePage();
  } else if (window.location.pathname === '/') {
    content = '<h1>¡Bienvenidos!</h1>';
  } else if(window.location.pathname === '/login'){
    content = loginPage();
  }else if(window.location.pathname === '/signup'){
    content = signupPage();
  }else if(window.location.pathname ==='/confirmsignup'){
    content=confirmSignupPage();
  }else if(window.location.pathname ==='/logout'){
    localStorage.removeItem('token');
    content = '<h1>¡Hasta pronto!</h1>';
    goTo("/");
  }
  var main = document.getElementsByTagName('main')[0];
  main.innerHTML = content;
}

/***********************************
             NAVEGACIÓN
************************************/
function navigate(evt) {
  evt.preventDefault();
  var href = evt.target.getAttribute('href');
  if(href==='/games'){
    getGames();
  }
  window.history.pushState({}, undefined, href);
  renderApp();
}

function goTo(path) {
  window.history.pushState({}, undefined, path);
  renderApp();
}

function newGame(event){
  goTo('/newgame');
}

function modifyGame(event){
  console.log("modifyGame");
  event.preventDefault();
  selectedId = $(this).attr('id').split("_")[1];
  modifyGamePrepare();
}


/***********************************
          INICIALIZACIÓN
************************************/
$(document).ready(init);

function init(){
  $("nav").click(navigate);
  $("body").on("click","form button[id='btnLogin']",login);
  $("body").on("click","form button[id='btnSignup']",signup);
  $("body").on("click","form button[id='btnConfirmSignup']",confirmSignup);
  $("body").on("click","button[id^='id']",deleteGame);
  $("body").on("click","button[id^='modify']",modifyGame);
  $("body").on("click","button[id='linkNewGame']",newGame);
  $("body").on("click","button[id='buttonSortByTitle']",sortByTitle);
  $("body").on("click","button[id='buttonSortByPlayers']",sortByPlayers);
  $("body").on("click","button[id='buttonSortById']",sortById);
  $("body").on("click","form button[id='btnNewGame']",putGame);
  $("body").on("click","form button[id='btnModifyGame']",postGame);
  renderApp();
}