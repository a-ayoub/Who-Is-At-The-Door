var https = require('https');
var request = require('request');
var queryString = require('querystring');

//FireBase
var firebase = require('firebase');

firebase.initializeApp({
  databaseURL: 'https://whos-at-the-door-bd527.firebaseio.com',
  serviceAccount: './Who\'s\ At\ The\ Door-524db9c73091.json'
});

var ref = firebase.database().ref('Alexa');
var root = firebase.database().ref();

function Database(){
}

Database.prototype.writeDatabase = function(callback){
    ref.child("Write").set("callFacialRecog");
    ref.on("child_changed", function(snap){
    	if(snap.val()!=null){
	    	if(snap.val().includes('doneRecog')){
	    		console.log("done");
	    		var name = snap.val().substring(10);
	    		console.log(name);
	    		ref.child("Write").set("");
	    		ref.child("Read").set("");
	    		callback(name);
	    	}
	    	else if (snap.val() == "Failed"){
	    		ref.child("Write").set("");
	    		ref.child("Read").set("");
	    		callback("noRecognize");
	    	}
	    	else if (snap.val() == "noPerson"){
	    		ref.child("Write").set("");
	    		ref.child("Read").set("");
	    		callback("noPerson");
	    	}
    	}
    });
}

Database.prototype.trainFaceCall = function(name, callback){
    var nameSend = 'callFacialTrain '+name;
    ref.child("Write").set(nameSend);

    ref.on("child_changed", function(snap){
    	if(snap.val()!=null){
	    	if(snap.val() == 'doneTrain'){
	    		console.log("done Traing");
	    		ref.child("Write").set("");
	    		ref.child("Read").set("");
	    		callback("Success");
	    	}
	    	else if (snap.val() == "Failed"){
	    		ref.child("Write").set("");
	    		ref.child("Read").set("");
	    		callback("Fail");
	    	}
    	}
    });
}

module.exports = Database;