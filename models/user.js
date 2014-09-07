/*

    - classes ~ tables
    - instances ~ rows
    - fields ~ columns
   
    Each Business uses belongsTo and hasOne for Time of Day
	-> ToD class has multiple instances for the business time (Broken up into 24 hours for more granularity?)
	//OLD IDEA: 8am-10:59am, 11am-1:59pm, 2pm-4:59pm, 5pm-7:59pm, 8pm-11:59pm, 12am-2:59am, 3am-5:59am, 6am-7:59am

*/
var async = require('async');
var util = require('util');
var uu = require('underscore');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
    id:         {type:          DataTypes.INTEGER,
                 autoIncrement: true,
                 primaryKey:    true},
	usrID:      {type:       DataTypes.STRING, 
	             unique:     true, 
				 allowNull:  false},
	password:   {type: DataTypes.STRING, allowNull: false},
	email:    	{type: DataTypes.STRING, allowNull: false},
	human:      {type: DataTypes.BOOLEAN, allowNull: false},
	phone:    	{type: DataTypes.INTEGER},
	firstname:  {type: DataTypes.STRING, allowNull: false},
	lastname:   {type: DataTypes.STRING, allowNull: false},
	gender:     {type: DataTypes.BOOLEAN, allowNull: false},
	dob:        {type: DataTypes.INTEGER},
	location:   {type: DataTypes.STRING},
	goog_login: {type: DataTypes.STRING},
	fb_login:   {type: DataTypes.STRING},
	yelp_login: {type: DataTypes.STRING},
	accuracy:   {type: DataTypes.INTEGER},
	reviews:    {type: DataTypes.INTEGER}
	}, {
	classMethods: {
	    numuser: function() {
		this.count().success(function(c) {
		    console.log("There are %s users", c);});
	    },
		createUser: function(userData, cb) {
		    var _user = this;
			//check if user exists just in case we somehow missed checking
			_user.find({where: {usrID: userData.username}}).complete(function(err, userInst) {
				    if (!!err) {
					    cb(false);
					} else if (userInst == null ) {
					    _user.create({usrID:      userData.username,
						              password:   userData.password,
						              email:      userData.email, 
									  human:      userData.human,
						              phone:      userData.phone,
									  firstname:  userData.firstname,
									  lastname:   userData.lastname,
									  gender:     userData.gender,
									  dob:        userData.dob,
									  loc:   userData.location,
									  goog_login: userData.goog_login,
									  fb_login:   userData.fb_login,
									  yelp_login: userData.yelp_login,
									  accuracy:   1000,
									  reviews:    0,}).success(function(err, userInst) {cb(true);});
					} else {
					    cb(false);					
					}
			});
			//create user
		},
		existUser: function(username, cb) {
		    var _user = this;
			_user.find({where: {usrID: username}}).complete(function(err, userInst) {
				    if (!!err) {
					    console.log(err);
					    cb(false);
					} else {
					    cb(userInst);					
					}
			});
		},
		loginUser: function(userData, cb) {
		    var _user = this;
			_user.find({where: {usrID: userData.username, password: userData.password}}).complete(function(err, userInst) {
				    if (!!err) {
					    console.log(err);
					    cb(null);
					} else {
					    cb(userInst);					
					}
				});
		}
	},
	instanceMethods: {
	    dummyFn: function() {
		    console.log("TEST");
	    },
	},
	//freeze the names
	freezeTableName: true,
	tableName: 'user'
    });
};
