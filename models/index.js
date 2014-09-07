if (!global.hasOwnProperty('db')) {

	//redis db
	var sessions = require('./session').createClient();

	//postgres db
    var Sequelize = require('sequelize');
    var sq = null;
    var fs = require('fs');
    var path = require('path');
    var PGPASS_FILE = path.join(__dirname, '../.pgpass');
    if (process.env.DATABASE_URL) {
        /* Remote database
           Do `heroku config` for details. We will be parsing a connection
           string of the form:
           postgres://bucsqywelrjenr:ffGhjpe9dR13uL7anYjuk3qzXo@\
           ec2-54-221-204-17.compute-1.amazonaws.com:5432/d4cftmgjmremg1
        */
        var pgregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        var match = process.env.DATABASE_URL.match(pgregex);
        var user = match[1];
        var password = match[2];
        var host = match[3];
        var port = match[4];
        var dbname = match[5];
        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            logging:  true //false
        };
        sq = new Sequelize(dbname, user, password, config);
		console.log("Connected to Heroku DB user: " + user);
    } else {
        /* Local database
           We parse the .pgpass file for the connection string parameters.
        */
        var pgtokens = fs.readFileSync(PGPASS_FILE).toString().trimRight().split(':');
        var host = pgtokens[0];
        var port = pgtokens[1];
        var dbname = pgtokens[2];
        var user = pgtokens[3];
        var password = pgtokens[4];
        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            logging:  true //false
        };
        var sq = new Sequelize(dbname, user, password, config);
	    console.log("Connected to Local DB user: " + user);
    }
    global.db = {
		sessions: sessions,
        Sequelize: Sequelize,
        sequelize: sq,
    };
}
module.exports = global.db;
