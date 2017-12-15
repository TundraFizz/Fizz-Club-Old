var app     = require("../server.js");
var mysql   = require("mysql");
var bcrypt  = require("bcryptjs");
var request = require("request");
var jwt     = require("jsonwebtoken");
var fs      = require("fs"); // File system library

app.get("/", function(req, res){
  var cookies = req.cookies;
  // res.clearCookie(i);
  var token   = null;
  var data    = {
    "tables": [],
    "clubs" : [],
    "login" : false
  };

  var sql  = "SELECT * FROM clubs;";
  var args = [];
  mySql.con.query(sql, args, function(err, result){

    var clubs = [];

    for(var i = 0; i < result.length; i++){
      console.log(result[i]);
      var club = {
        "region" : result[i]["region"],
        "tag"    : result[i]["tag"],
        "members": []
      }

      var sql  = "SELECT * FROM members WHERE clubs_id=?";
      var args = [result[i]["id"]];
      mySql.con.query(sql, args, function(err, result){
        console.log(result);
      });
    }

    // var sql  = "SELECT * FROM members WHERE clubs_id=?";
    // var args = [];
    // mySql.con.query(sql, args, function(err, result){
    // });

    data["tables"] = result;

    if(typeof cookies["token"] != "undefined"){
      // We have a token so let's verify it. If it's a bad token, delete the cookie
      var token = cookies["token"];

      jwt.verify(token, FC.cert, function(err, decoded){
        if(err){
          res.render("index.ejs", data); // Invalid signature
        }else{
          mySql.con.query(sql, args, function(err, result){
            data["login"] = decoded;
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
  // Check username and password. If good, create a token and send it to the user
  var username = req["body"]["username"];
  var password = req["body"]["password"];

  // Check the hashed password
  var sql  = "SELECT * FROM users WHERE username=?;";
  var args = [username];
  mySql.con.query(sql, args, function(err, result){
    if(result.length){
      var groupsId = result[0]["groups_id"];
      var clubsIn  = result[0]["clubs_in"].split(",");
      bcrypt.compare(password, result[0]["password_hash"], function(err, result){
        if(result){
          // Passwords match
          var obj = {
            "user": username
          };

          var sql  = "SELECT * FROM groups WHERE id=?";
          var args = [groupsId];
          mySql.con.query(sql, args, function(err, result){
            for(i in result[0]){
              if(i != "id")
                obj[i] = result[0][i];
            }

            var sql;
            var args;

            if(obj["manage_clubs"]){
              sql  = "SELECT * FROM clubs;";
              args = [];
            }else{
              sql  = "SELECT * FROM clubs WHERE id IN (?);";
              args = [clubsIn];
            }

            mySql.con.query(sql, args, function(err, result){
              var clubs = [];
              for(i in result){
                var temp = {};
                for(j in result[i])
                  temp[j] = result[i][j];
                clubs.push(temp);
              }

              obj["clubs"] = clubs;
              console.log(obj);
              var token = jwt.sign(obj, FC.cert);
              res.cookie("token", token, {"maxAge": 1000000, "httpOnly": true});
              res.json({"reload":"true"});
            });
          });
        }else{
          console.log("Invalid username and/or password"); // Passwords don't match
          res.json({"reload":"false"});
        }
      });
    }else{
      console.log("Invalid username and/or password"); // User doesn't exist in database
      res.json({"reload":"false"});
    }
  });
});

app.post("/logout", function(req, res){
  res.clearCookie("token");
  res.json({"reload":"true"});
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
