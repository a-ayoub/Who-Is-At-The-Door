var https = require('https');
var request = require('request');
var queryString = require('querystring');

//FireBase
var firebase = require('firebase');

firebase.initializeApp({
  databaseURL: 'https://whos-at-the-door-bd527.firebaseio.com',
  serviceAccount: './Who\'s\ At\ The\ Door-524db9c73091.json'
});

function Database(){
}

Database.prototype.writeDatabase = function(callback){
	var ref = firebase.database().ref('Alexa');
	var root = firebase.database().ref();
    var x = ref.push();
    x.set({Write: 'callFacialRecog'});
    ref.on("child_added", function(snap){
    	if(snap.child("Read").val()!=null){
	    	if(snap.child("Read").val().includes('doneRecog')){
	    		console.log("done");
	    		var name = snap.child("Read").val().substring(10);
	    		console.log(name);
	    		callback(name);
	    	}
	    	else if (snap.child("Read").val() == "Failed"){
	    		callback("noRecognize");
	    	}
    	}
    });
}

Database.prototype.trainFaceCall = function(callback){
	var ref = firebase.database().ref('Alexa');
	var root = firebase.database().ref();
    var x = ref.push();
    x.set({Write: 'callFacialTrain'});

    //put training logic here

    callback();
}

module.exports = Database;