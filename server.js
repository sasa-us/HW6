var express = require("express"),
    http = require("http"),
    app = express();
//page 219
var redis = require("redis");
var redisClient;
redisClient = redis.createClient();
var counts = {}; //empty string need use parseInt

var bodyParser = require('body-parser');
app.use(bodyParser.json()); //support json encoded body
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded body
//app.use(express.urlencoded());

//start server
http.createServer(app).listen(3000);
console.log("Server start!.");
redisClient.on('connect', function() {
    console.log('redis connected');
});

//page221 
//parseInt(string, radix);
//get initialized with data stored inRedis before start  http://blog.semmy.me/post/19536526990/web-applications-with-express-and-nodejs
redisClient.mget(['wins', 'losses'], function(err, resultsCount) {
    if (err !== null) {
        console.log("error: " + err);
        return;
    }
    counts.wins = parseInt(resultsCount[0], 10) || 0; //resultsCount[0] is win
    counts.losses = parseInt(resultsCount[1], 10) || 0;
    console.log("wins:", counts.wins);
    app.post("/flip", function(req, res) {
        //grab post obj param from req.body
        var myFlip = req.body;

        var coin = ["heads", "tails"];
        var randomNum = Math.floor(Math.random() * 2);

        if (myFlip["call"] === coin[randomNum]) {
            redisClient.incr('wins');
            counts.wins = counts.wins + 1;
            console.log("got wins", counts.wins);
            res.json({
                "result": "wins"
            });
        } else {
            redisClient.incr('losses');
            counts.losses = counts.losses + 1;
            res.json({
                "result": "lose"
            });
        }
    }); // end app.post
}); //end redisClient.mget

// set up routes and response
app.get("/stats", function(req, res) {
    //res.send("sha's routes");
    res.send("wins: " + counts.wins + "," + "losses: " + counts.losses);
}); //end app.get


//delete (to show the delete result use CMD: curl -X DELETE http://localhost:3000/stats)
//http://expressjs.com/en/starter/basic-routing.html
app.delete("/stats", function(req, res) {
    redisClient.set("wins", 0);
    redisClient.set("losses", 0);
    res.send("Got a DELETE request at /stats");
});