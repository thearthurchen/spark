/*

*/

//maintain active spark sessions with redis
var async = require('async')
, util 	= require('util')
, uu 		= require('underscore')
, redis = require('redis')
, jwt 	= require("jwt-simple")
, url	 	= require('url');

var sessionClient = function() {

this.sessions = null;
	//check if the redisURL exists..hopefully from Heroku if not use local
	if (process.env.REDISCLOUD_URL) {
		var redisURL = url.parse(process.env.REDISCLOUD_URL);
		this.sessions 		= redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
		this.sessions.auth(redisURL.auth.split(":")[1]);
	} else {
		this.sessions 		= redis.createClient();
	}
	return this;
};
//generate a sessiion with timeout, token, sparkinfo and return the token based on sparkname
sessionClient.prototype.addSpark = function(spark, cb) {
	var _sessions = this.sessions;
	var status = "ready";
	if (spark == null) {
		cb("null", null);
	//use jwt to encode it based on some secret and we will also add spark session, token, data to redis
	} else {
		//insert into token store
		_sessions.hset("sparks", spark, status, function(err, _status) {
			cb(null, 0);
		});
	}
};
//grab a session (authenticate it) this provides spark data..could be expensive with lots of sessions
sessionClient.prototype.getSpark = function(spark, cb) {
	var _sessions = this.sessions;
	this.sessions.hget("sparks", spark, function (err, _status) {
		cb(err, _status);
	});
};

sessionClient.prototype.cookSpark = function(spark, cb) {
	var _sessions = this.sessions;
	_sessions.hset("sparks", spark, status, function(err, _status) {
		cb(err, status);
	});

};

sessionClient.prototype.deleteSession = function(spark, cb) {
	var _sessions = this.sessions;
	_sessions.hdel("sparks", spark, function(err, resp) {
	});
};

module.exports.createClient = function() {
  return new sessionClient();
};
