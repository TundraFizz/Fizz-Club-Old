var app     = require("../server.js");
var mysql   = require("mysql");
var bcrypt  = require("bcryptjs");
var request = require("request");
var jwt     = require("jsonwebtoken");
var moment  = require("moment");
var fs      = require("fs"); // File system library

var globalApiKey = "RGAPI-212fd0c3-aedd-4cff-b978-b7a0f115d998"; // DELETE THIS LATER

app.get("/", function(req, res){
  var FC = new FizzClub(req.cookies);

  FC.GetApiVersion()
  .then(() => FC.CheckLogin(res))
  .then(() => FC.GetMainPage1())
  // .then(() => res.render("index.ejs", FC.data))
  .then(() => {console.log(FC.data);res.render("index.ejs", FC.data);})
  .catch((err) => console.log("ERR!", err));
});

app.post("/testing", function(req, res){
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
  //     var sql  = "SELECT * FROM members ORDER BY id DESC LIMIT 1";
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

app.post("/create-account", function(req, res){
  var username = req["body"]["username"];
  var password = req["body"]["password"];
  var groupsId = 3;  // Lowest rank: Club Member
  var clubsIn  = ""; // No clubs

  bcrypt.hash(password, 12, function(err, hash){
    var sql  = "INSERT INTO users (groups_id, username, clubs_in, password_hash) VALUES (?,?,?,?)";
    var args = [groupsId, username, clubsIn, hash];

    mySql.con.query(sql, args, function(err, result){
      if(err)
        res.json({"r": 0, "msg": `That account name has already been taken, please choose a different one`});
      else
        res.json({"r": 1, "msg": `The account ${username} has been created`});
    });
  });
});

app.post("/login", function(req, res){
  var FC = new FizzClub(req.cookies);

  // Check username and password. If good, create a token and send it to the user
  var username = req["body"]["username"];
  var password = req["body"]["password"];

  // Check the hashed password
  var sql  = "SELECT * FROM users WHERE username=?";
  var args = [username];
  mySql.con.query(sql, args, function(err, result){
    if(result.length){
      var id = result[0]["id"];
      bcrypt.compare(password, result[0]["password_hash"], function(err, result){
        if(result){
          // Passwords match
          var token = jwt.sign({"id":id}, FC.cert);
          res.cookie("token", token, {"maxAge": 1000000, "httpOnly": true});
          res.json({"reload":"true"});
        }else{
          // Passwords don't match
          res.json({"reload":"false","err":"Invalid username and/or password"});
        }
      });
    }else{
      // User doesn't exist in database
      res.json({"reload":"false","err":"Invalid username and/or password"});
    }
  });
});

app.post("/logout", function(req, res){
  res.clearCookie("token");
  res.json({"reload":"true"});
});

app.post("/create-club", function(req, res){
  var region = req["body"]["region"];
  var tag    = req["body"]["tag"].replace(/^\s+|\s+$/g, "");

  if((region != "NA" && region != "OCE" && region != "EUW" && region != "EUNE") ||
     (tag.length < 2 || tag.length > 5)){
    res.json({"result":"failed","reload":"false"});
    return;
  }

  var tableName = `club_${region}_${tag}`.toLowerCase();
  var sql = `SHOW TABLES LIKE ?`;
  var args = [tableName];

  mySql.con.query(sql, args, function(err, result){
    if(result.length == 1){
      res.json({"result":"failed","reload":"false"});
    }else{
      var vars = `(
      id             INT(10)     NOT NULL AUTO_INCREMENT,
      summoner_id    INT(20)     NOT NULL,
      summoner_name  VARCHAR(20) NOT NULL,
      summoner_level INT(10)     NOT NULL,
      summoner_icon  INT(10)     NOT NULL,
      fizz_points    INT(20)     NOT NULL,
      last_played    TIMESTAMP       NULL DEFAULT NULL,
      PRIMARY KEY (id)
      )`;
      var sql = `CREATE TABLE ${tableName} ${vars} ENGINE = InnoDB`;
      mySql.con.query(sql, function(err, result){
        if(err){
          res.json({"result":"failed","reload":"false"});
        }else{
          var  sql = "INSERT INTO clubs (region, tag, club_table) VALUES (?,?,?)";
          var args = [region, tag, tableName];
          mySql.con.query(sql, args, function(err, result){
            console.log("Club created!");
            res.json({"result":"success","reload":"true"});
          });
        }
      });
    }
  });
});

app.post("/delete-club", function(req, res){
  var club = req["body"]["choice"];
  var sql  = `DROP TABLE ${club}`;

  mySql.con.query(sql, function(err, result){
    var sql  = "DELETE FROM clubs WHERE club_table=?";
    var args = [club];

    mySql.con.query(sql, args, function(err, result){
      console.log("Club deleted");
      res.json({"reload":"true"});
    });
  });
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

function FizzClub(cookies){
  this.cookies = cookies;
  this.apiKey = "RGAPI-212fd0c3-aedd-4cff-b978-b7a0f115d998";
  this.cert   = fs.readFileSync("private.key");
  this.apiVersion = null;
  this.data   = {
    "clubs"     : [],
    "login"     : null,
    "apiVersion": null
  };
}

FizzClub.prototype.GetApiVersion = function(){return new Promise((resolve) => {
  var self = this;
  request("https://ddragon.leagueoflegends.com/api/versions.json", {json:true}, (err, res, body) => {
    self["apiVersion"]         = body[0];
    self["data"]["apiVersion"] = body[0];
    resolve();
  });
})}

FizzClub.prototype.AddMember = function(data){return new Promise((resolve) => {
  var self = this;
  console.log(data);

  //

  GetDataFromSummonerName

  resolve();
})}

FizzClub.prototype.RemoveMember = function(){return new Promise((resolve) => {
})}

FizzClub.prototype.UpdateMembers = function(){return new Promise((resolve) => {
})}

FizzClub.prototype.GetFizzData = function(id, region){return new Promise((resolve) => {
  var self = this;
  var map = {
    "NA"  : "na1",
    "OCE" : "oc1",
    "EUW" : "euw1",
    "EUNE": "eun1"
  };
  region  = map[region];
  var url = `https://${region}.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${id}/by-champion/105?api_key=${self.apiKey}`;
  request(url, {json:true}, (err, res, body) => {
    resolve(body);
  });
})}

FizzClub.prototype.UpdateEverybody = function(){return new Promise((resolve) => {
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

FizzClub.prototype.GetMainPage1 = function(){return new Promise((resolve) => {
  var self = this;
  var sql  = "SELECT * FROM clubs ORDER BY FIELD(region,?,?,?,?), tag";
  var args = ["NA", "OCE", "EUW", "EUNE"];
  mySql.con.query(sql, args, function(err, result){
    self.counter = result.length;

    if(self.counter == 0)
      resolve();

    for(var i = 0; i < result.length; i++){
      var obj = {
        "region"   : result[i]["region"],
        "tag"      : result[i]["tag"],
        "clubTable": result[i]["club_table"],
        "members"  : []
      };

      self["data"]["clubs"].push(obj);

      self.GetMainPage2(self["data"]["clubs"][i])
      .then(() => {
        if(--self.counter == 0){
          resolve();
        }
      });
    }
  });
})}

FizzClub.prototype.GetMainPage2 = function(club){return new Promise((resolve) => {
  var self = this;
  var sql  = `SELECT * FROM ${club["clubTable"]} ORDER BY summoner_name`;
  var args = [];
  mySql.con.query(sql, args, function(err, result){
    for(var i = 0; i < result.length; i++){
      var lastPlayed = moment().diff(result[i]["last_played"], "days");
      if(lastPlayed == 0)
        lastPlayed = "Today";
      else if(lastPlayed == 1)
        lastPlayed += " day ago";
      else
        lastPlayed += " days ago";

      var obj = {
        "summonerId"   : result[i]["summoner_id"],
        "summonerName" : result[i]["summoner_name"],
        "summonerLevel": result[i]["summoner_level"],
        "summonerIcon" : result[i]["summoner_icon"],
        "fizzPoints"   : result[i]["fizz_points"],
        "lastPlayed"   : lastPlayed
      };
      club["members"].push(obj);
    }
    resolve();
  });
})}

FizzClub.prototype.CheckLogin = function(res){return new Promise((resolve) => {
  var self = this;
  var loginInfo = {};

  if(typeof self.cookies["token"] != "undefined"){
    // We have a token so let's verify it. If it's a bad token, delete the cookie
    var token = self.cookies["token"];

    jwt.verify(token, self.cert, function(err, decoded){
      if(err){
        res.clearCookie("token");
        resolve();
      }else{
        var sql  = "SELECT * FROM users WHERE id=?";
        var args = [decoded["id"]];
        mySql.con.query(sql, args, function(err, result){
          var groupsId          = result[0]["groups_id"];
          loginInfo["username"] = result[0]["username"]
          loginInfo["clubsIn"]  = result[0]["clubs_in"].split(",");

          var sql  = "SELECT * FROM groups WHERE id=?";
          var args = [groupsId];
          mySql.con.query(sql, args, function(err, result){
            for(i in result[0]){
              if(i != "id")
                loginInfo[i] = result[0][i];
            }
            self["data"]["login"] = loginInfo;
            resolve();
          });
        });
      }
    });
  }else{
    resolve(); // Not logged in
  }
})}

function YoloSwag(summonerName, region, club){
  this.summonerName = summonerName;
  this.region       = region;
  this.club         = club;
  this.error        = false;
}

YoloSwag.prototype.CheckIfSummonerIsInClub = function(){return new Promise((resolve, reject) => {
  var self = this;

  var sql  = `SELECT COUNT(*) as count FROM ${self.club} WHERE summoner_name=?;`;
  var args = [self.summonerName];
  mySql.con.query(sql, args, function(err, result){
    if(err){
      reject(`${self.club} doesn't exist`);
      return;
    }

    if(result[0]["count"] == 0){
      resolve();
    }else{
      reject(`${self.summonerName} already exists in ${self.club}`);
    }
  });
})}

YoloSwag.prototype.GetDataFromSummonerName = function(){return new Promise((resolve, reject) => {
  var self   = this;
  var name   = self["summonerName"];
  var region = self["region"];

  var map = {
    "NA"  : "na1",
    "OCE" : "oc1",
    "EUW" : "euw1",
    "EUNE": "eun1"
  };

  var safe = encodeURI(name);
  region   = map[region];
  var url  = `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${safe}?api_key=${globalApiKey}`;

  request(url, {json:true}, (err, res, body) => {
    if(typeof body["status"] != "undefined" && body["status"]["status_code"] == 404){
      reject("This summoner doesn't exist");
      return;
    }

    if(err)
      reject(err);
    else{
      self["id"]            = body["id"];
      self["profileIconId"] = body["profileIconId"];
      self["summonerLevel"] = body["summonerLevel"];
      resolve(body);
    }
  });
})}

YoloSwag.prototype.GetFizzData = function(){return new Promise((resolve, reject) => {
  var self   = this;
  var id     = self["id"];
  var region = self["region"];

  var map = {
    "NA"  : "na1",
    "OCE" : "oc1",
    "EUW" : "euw1",
    "EUNE": "eun1"
  };

  region  = map[region];
  var url = `https://${region}.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${id}/by-champion/105?api_key=${globalApiKey}`;

  request(url, {json:true}, (err, res, body) => {
    if(typeof body["status"] != "undefined" && body["status"]["status_code"] == 404){
      reject("This summoner has no games with Fizz");
      return;
    }

    if(err)
      reject(err);
    else{
      self["championPoints"] = body["championPoints"];
      self["lastPlayTime"]   = body["lastPlayTime"];
      resolve(body);
    }
  });
})}

YoloSwag.prototype.AddSummonerToClub = function(){return new Promise((resolve, reject) => {
  var self = this;
  var club = self["club"];

  var summonerId    = self["id"];
  var summonerIcon  = self["profileIconId"];
  var summonerName  = self["summonerName"];
  var summonerLevel = self["summonerLevel"];
  var fizzPoints    = self["championPoints"];
  var lastPlayed    = self["lastPlayTime"].toString().slice(0, -3);

  var  sql = `INSERT INTO ${club} (summoner_id, summoner_icon, summoner_name, summoner_level, fizz_points, last_played) VALUES (?,?,?,?,?,FROM_UNIXTIME(?))`;
  var args = [summonerId, summonerIcon, summonerName, summonerLevel, fizzPoints, lastPlayed];
  mySql.con.query(sql, args, function(err, result){
    if(err)
      reject(err);
    else
      resolve();
  });
})}

var mySql = new MySql();

// Test();

function Test(){
  AddToClub("Tundra Fizz", "NA", "club_na_fizz");
  AddToClub("Sohleks", "NA", "club_na_fizz");
  AddToClub("Abdul", "NA", "club_na_fizz");
  AddToClub("GnarsBadFurDay", "NA", "club_na_fizz");
  AddToClub("Zakkery", "NA", "club_na_fizz");

  AddToClub("Fisherman Fizz", "NA", "club_na_swag");
  AddToClub("Atlantean Fizz", "NA", "club_na_swag");
  AddToClub("Void Fizz", "NA", "club_na_swag");
  AddToClub("PG 0ne Magneto", "NA", "club_na_swag");
  AddToClub("kimalsgud", "NA", "club_na_swag");
  AddToClub("GeGe InInDerr", "NA", "club_na_swag");
  AddToClub("LegacyOfDanny", "NA", "club_na_swag");
  AddToClub("LittleBro123", "NA", "club_na_swag");

  AddToClub("Super Galaxy", "OCE", "club_oce_fish");
  AddToClub("Tsdlk sdfjfk", "OCE", "club_oce_fish");
  AddToClub("Fish", "OCE", "club_oce_fish");
}

function AddToClub(summonerName, region, club){

  var yoloSwag = new YoloSwag(summonerName, region, club);

  yoloSwag.CheckIfSummonerIsInClub()
  .then(() => yoloSwag.GetDataFromSummonerName())
  .then(() => yoloSwag.GetFizzData())
  .then(() => yoloSwag.AddSummonerToClub())
  .then(() => console.log("GOOD!"))
  // .catch((err) => console.log("ERR!"));
  .catch((err) => console.log("ERR!", err));
}
