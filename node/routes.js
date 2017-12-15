var app     = require("../server.js");
var mysql   = require("mysql");
var bcrypt  = require("bcrypt");
var request = require("request");
var jwt     = require("jsonwebtoken");
var fs      = require("fs"); // File system library

app.get("/", function(req, res){
  var cookies = req.cookies;
  // res.clearCookie(i);
  var token   = null;
  var data    = {
    "tables": [],
    "admin" : []
  }

  var sql  = "SELECT * FROM members;";
  var args = [];
  mySql.con.query(sql, args, function(err, result){
    data["tables"] = result;

    if(typeof cookies["token"] != "undefined"){
      // We have a token so let's verify it. If it's a bad token, delete the cookie
      var token = cookies["token"];

      jwt.verify(token, FC.cert, function(err, decoded){
        if(err){
          res.render("index.ejs", data); // Invalid signature
        }
        else{
          // var user    = decoded["user"];
          var clubTag    = decoded["tag"];
          var clubRegion = decoded["region"];

          var sql  = "SELECT * FROM members WHERE club_tag=? AND summoner_region=?";
          var args = [clubTag, clubRegion];
          mySql.con.query(sql, args, function(err, result){
            data["admin"] = result;
            res.render("index.ejs", data);
          });
        }
      });
    }else{
      // Not logged in
      res.render("index.ejs", data);
    }
  });
});

app.post("/testing", function(req, res, next){
  var cookies = req.cookies;

  if(typeof cookies["token"] == "undefined"){
    // token doesn't exist
  }else{

  }

  // Set a cookie
  // var randomNumber=Math.random().toString();
  // randomNumber=randomNumber.substring(2,randomNumber.length);
  // var data = "Something here"
  // data = randomNumber;
  // res.cookie('cookieName', data, { maxAge: 900000, httpOnly: true });
  // res.json({"a":"b"});









  // FC.AddMember(req["body"])
  // .then(() => console.log("DONE"));

  // FC.GetDataFromSummonerName("Lord Dusteon").then((data) => console.log(data, "Atlantean Fizz"));
});

app.post("/add-to-club", function(req, res){
  console.log(req["body"]);
  // res.json({});
  var sql  = "INSERT INTO members (summoner_name, summoner_region) VALUES (?,?)";

  // The region is specified from the token
  var region = "NA";

  FC.GetDataFromSummonerName(req["body"]["name"], region)
  .then((data) => {
    var id            = data["id"];
    var profileIconId = data["profileIconId"];
    var summonerLevel = data["summonerLevel"];

    var sql  = "SELECT COUNT(*) as count FROM members WHERE summoner_id=? AND summoner_region=?";
    var args = [id, region];
    console.log(args);
    mySql.con.query(sql, args, function(err, result){
      var count = result[0]["count"];
      if(count == 0){

      }else{
        console.log("That user already exists in the database");
      }
    });
  });

  // var args = [req["body"]["name"], region];

  // mySql.con.beginTransaction(function(err){
  //   mySql.con.query(sql, args, function(err, result){
  //     var sql  = "SELECT * FROM members ORDER BY id DESC LIMIT 1;";
  //     var args = [];
  //     mySql.con.query(sql, args, function(err, result){
  //       console.log(result);
  //       mySql.con.commit(function(err){

  //       });
  //     });
  //   });
  // });
});

app.post("/remove-from-club", function(req, res){
  console.log(req["body"]);
  res.json({});
});

app.post("/login", function(req, res){

  // Check username and password
  // If good, create a token and send it to the user
  var username = req["body"]["username"];
  var password = req["body"]["password"];
  console.log(username);
  console.log(password);

  // Check the hashed
  var sql  = "SELECT password_hash FROM users WHERE username=?;";
  var args = [username];
  mySql.con.query(sql, args, function(err, result){
    if(result.length){
      bcrypt.compare(password, result[0]["password_hash"], function(err, res){
        if(res){
          // Passwords match
          console.log("Passwords match");



        }else{
          // Passwords don't match
          console.log("Passwords DON'T match");
        }
      });
    }else{
      // User doesn't exist in database
    }
  });

  // var obj = {
  //   "user"  : "sample",
  //   "region": "NA",
  //   "tag"   : "Fizz"
  // };
  // var token = jwt.sign(obj, FC.cert);

  // res.cookie("token", token, {"maxAge": 900000, "httpOnly": true});
  // res.json({});

  return;

  // console.log(jwt.decode(token2));

  var sql  = "SELECT * FROM users WHERE username=?";
  var args = [req["body"]["name"]];
  mySql.con.query(sql, args, function(err, result){
    var token = result[0]["token"];
    var obj = {
      "token": token
    }
    res.json(obj);
  });
});

app.post("/logout", function(req, res){
  res.clearCookie("token");
  res.json(null);
});

function CreateAccount(){
  var username = "admin";
  var password = "admin";
  console.log("Hashing...");
  bcrypt.hash(password, 12, function(err, hash){
    console.log(hash);
  });

  var sql  = "";
  var args = [];
  mySql.con.query(sql, args, function(err, result){
    console.log("DONE");
  });
}

function GetTokenFromUser(){
  var sql  = "SELECT * FROM users WHERE username=?";
  var args = ["test"];

  // mySql.con.query(sql, args, function(err, result){
  //   var token = result[0]["token"];
  //   var obj = {
  //     "token": token
  //   }
  //   console.log(obj);
  //   // res.json(obj);
  // });

  console.log("Generate a token");

  console.log("===================================================");
  var token = jwt.sign({ "foo": "bar" }, "shhhhh");
  console.log(token);
  console.log("> DECODE");
  console.log(jwt.decode(token));

  console.log("===================================================");
  var cert = fs.readFileSync("private.key");
  var token2 = jwt.sign({ foo: "bar" }, cert);
  // var token = jwt.sign({ foo: "bar" }, cert, { algorithm: "ES512"});
  console.log(token2);
  console.log("> DECODE");
  console.log(jwt.decode(token2));

  console.log("===================================================");
  console.log("> VERIFY");
  var testing_1 = jwt.verify(token, "shhhhh");
  console.log(testing_1);
  var testing_2 = jwt.verify(token2, cert);
  console.log(testing_2)
}

app.use(function (req, res){
  res.render("404.ejs");
});

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function MySql(){
  this.con = mysql.createConnection({
    "host"    : "localhost",
    "user"    : "root",
    "password": "",
    "database": "fizz_club"
  });
}

function FizzClub(){
  this.apiKey = "RGAPI-8076861f-af7d-4cc5-9850-a2e68912bfd4";
  this.cert   = fs.readFileSync("private.key");
  this.data   = [];
  this.html   = "";
}

FizzClub.prototype.AddMember = function(data){return new Promise((resolve) => {
  console.log(data)

  resolve();
})}

FizzClub.prototype.RemoveMember = function(){return new Promise((resolve) => {
})}

FizzClub.prototype.UpdateMembers = function(){return new Promise((resolve) => {
})}

FizzClub.prototype.TestingStuff = function(){return new Promise((resolve) => {
  var self = this;

  var ids = [
    76750532, // Super Galaxy
    66452348, // Atlantean Fizz
    20782632, // Tundra Fizz
    63416411, // Void Fizz
    24386577, // Fisherman Fizz
    40009482  // Lord Dusteon
  ];

  var counter = ids.length;

  for(var i = 0; i < ids.length; i++){
    var id = ids[i];
    (function(i){
      var url = `https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${ids[i]}/by-champion/105?api_key=${self.apiKey}`;
      request(url, {json:true}, (err, res, body) => {
        // { status: { message: 'Rate limit exceeded', status_code: 429 } } }
        // console.log(body["status"]["status_code"]);

        var playerId       = body["playerId"];
        var championPoints = body["championPoints"];
        var lastPlayTime   = body["lastPlayTime"];

        var url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/${playerId}?api_key=${self.apiKey}`;

        request(url, {json:true}, (err, res, body) => {
          // console.log(body["status"]["status_code"]);

          var name          = body["name"];
          var profileIconId = body["profileIconId"];
          var summonerLevel = body["summonerLevel"];
          var obj = {
            "playerId"      : playerId,
            "name"          : name,
            "summonerLevel" : summonerLevel,
            "profileIconId" : profileIconId,
            "championPoints": championPoints,
            "lastPlayTime"  : lastPlayTime
          }

          self["data"].push(obj);

          if(--counter == 0){
            resolve();
          }
        });
      });
    })(i);
  }
})}

FizzClub.prototype.GetDataFromSummonerName = function(name, region){return new Promise((resolve) => {
  var self = this;

  var map = {
    "NA"  : "na1",
    "OCE" : "oc1",
    "EUW" : "euw1",
    "EUNE": "eun1"
  };
  var safe = encodeURI(name);
  region   = map[region];
  var url  = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${safe}?api_key=${self.apiKey}`;

  request(url, {json:true}, (err, res, body) => {
    resolve(body);
  });
})}

var mySql = new MySql();
var FC = new FizzClub();
// GetTokenFromUser();
// CreateAccount();
