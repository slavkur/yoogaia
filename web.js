// Initiate requirements
var express = require("express");
var OpenTokLibrary = require('opentok');

// Env variables
var urlSessions = {};
var apikey = '43672442';
var secretkey = '2d109ea79c71e50d427fa39c3cea3b36ad1c33db';
var OpenTokObject = new OpenTokLibrary.OpenTokSDK(apikey, secretkey);

// Create app, set ejs
var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

// Set the port and listen
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

function tokresponse(sessionId, req, res){
  // request for token per session, render stream
  var token = OpenTokObject.generateToken({session_id: sessionId});
  var data = {OpenTokKey:apikey, sessionId: sessionId, token:token};
  console.log('teacher-console', req.params.teacher == undefined);
  res.render('stream-' + ((req.params.teacher != undefined) ? req.params.teacher : 'student'), data);
}
function createSession(req, res) {
  // avoid students to guess the url of the teacher
  if(req.params.teacher && req.params.teacher != 'teacher') {
    res.send(404);
  }
  // render stream pages
  if (urlSessions[req.params.room] == undefined) {
    OpenTokObject.createSession(function(sessionId){
      urlSessions[req.params.room] = sessionId;
      tokresponse(sessionId, req, res);
    });
  } else {
    sessionId = urlSessions[req.params.room];
    tokresponse(sessionId, req, res);
  }
}


app.get('/', function(request, response) {
  // basic render
  response.send('Hello World!');
});
app.get("/stream/:room", createSession);
app.get("/stream/:teacher/:room", createSession);