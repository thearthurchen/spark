var uu 			= require("underscore")
  , async 		= require('async')
  , db 			= require("./models")
  , jwt 			= require("jwt-simple")


var indexfn = function(request, response) {
    //Check useragent to see if they"re on mobile to redirect 
    var ua = request.headers["user-agent"];
	var uaType = {};
	//Find the location of client to potential load balance
	var ip = request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress
	         || request.headers["x-forwarded-for"];
	console.log(ip);
	if (/mobile/i.test(ua))
        uaType.Mobile = true;
	if (uaType.Mobile) {
	    response.json({status: "OK"});
    } else {
        response.json({status: "OK"});
	}
};

var addSpark = function(request, response) {

	var cb = function(err, resp) {
		response.json({'status': resp});
	};

	if(request.query.spark == null) {
		response.json(null);
	} else {
		global.db.sessions.addSpark(request.query.spark, cb);
	}

}

var getSpark = function(request, response) {

	var cb = function(err, data, status) {
		response.json({'status': status});
	};

	if(request.query.spark == null) {
		response.json(null);
	} else {
		global.db.sessions.getSpark(request.query.spark, cb);
	}


};

var cookSpark = function(request, response) {

	var cb = function(err, data, status) {
		response.json({'status': status});
	};

	if(request.query.spark == null) {
		response.json(null);
	} else {
		global.db.sessions.cookSpark(request.query.spark, cb);
	}

};

var stopSpark = function(request, response) {

	var cb = function(err, data, status) {
		response.json({'status': status});
	};

	if(request.query.spark == null) {
		response.json(null);
	} else {
		global.db.sessions.cookSpark(request.query.spark, cb);
	}

};

var postscorefn = function(request, response) {

	//package data
	console.log(request.body);
	var data = {user: request.body.user, score: request.body.score};
	
	var resp = function(err, result) {
		if (result == null) {
			response.json(false);
		} else {
			response.json(true);
		}
	};

	global.db.sessions.postScore(data, resp);

};



var define_routes = function(dict) {
    var toroute = function(item) {
	return uu.object(uu.zip(["path", "fn"], [item[0], item[1]]));
    };
    return uu.map(uu.pairs(dict), toroute);
};

var ROUTES = define_routes({
    "/": indexfn,
	"/spark": addSpark,
});

var ROUTES_POST = define_routes({
    "/spark" : cookSpark,

});

module.exports = {"ROUTES" : ROUTES, "ROUTES_POST" : ROUTES_POST};
