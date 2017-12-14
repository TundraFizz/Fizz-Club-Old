var app     = require("../server.js");
var mysql   = require("mysql");
var request = require("request");
var fs      = require("fs"); // File system library

app.get("/", function(req, res){

  var data = {
    "tables": [],
    "admin" : []
  }

  var sql  = "SELECT * FROM members;";
  var args = [];
  mySql.con.query(sql, args, function(err, result){
    data["tables"] = result;

    // If logged in
    if(true){
      var sql  = "SELECT * FROM members WHERE club_tag=? AND summoner_region=?";
      var args = ["Fizz", "NA"];
      mySql.con.query(sql, args, function(err, result){
        console.log(result);
        data["admin"] = result;
        res.render("index.ejs", data);
      });
    }else{
      res.render("index.ejs", data);
    }
  });
});

app.post("/testing", function(req, res){

  FC.AddMember(req["body"])
  .then(() => console.log("DONE"));

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
