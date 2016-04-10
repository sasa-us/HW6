//redis-test.js
var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1");
client.on("error", function(err) {
	console.log("err: "+ err);
});

client.on("connect", function() {
	client.set("name_key", "hello world", function(err, reply) {
		console.log(reply.toString());
	});

	client.get("name_key", function(err, reply) {
		console.log(reply.toString());
	});
});