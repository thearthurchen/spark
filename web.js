require('newrelic');

var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , async   = require('async')
  , db      = require('./models')
  , routes  = require('./routes');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger("dev"));
app.use(express.json());
app.use(express.urlencoded());	

for(var ii in routes.ROUTES) {
    app.get(routes.ROUTES[ii].path, routes.ROUTES[ii].fn);
}

for(var ii in routes.ROUTES_POST) {
    app.post(routes.ROUTES_POST[ii].path, routes.ROUTES_POST[ii].fn);
}
//going to need app.put?

var server = http.createServer(app);

global.db.sequelize.sync({force: true, logging: console.log}).complete(function(err) {
    if (err) {
	console.log(err);
	throw err;
    } else {
	var DB_REFRESH_INTERVAL_SECONDS = 60*1; //want to check every 5 minutes? every minute?
	async.series([
	    function(cb) {
		// Begin listening for HTTP requests to Express app
		server.listen(app.get('port'), function() {
		    console.log("Listening on " + app.get('port'));
		});
		// Start a simple daemon to backup database and probably clear out disconnected sockets?
		setInterval(function() {
			console.log("Refresh");
		//keep on refreshing every 5 minutes to find non updated stuff?
		//global.db.heartbleed.purgeBeats sms? we need to have sockets..or have angular do work
		}, DB_REFRESH_INTERVAL_SECONDS*500);
		cb(null);
	    }
	]);
    }
});
