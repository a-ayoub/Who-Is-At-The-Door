var https = require('https');
var request = require('request');
var queryString = require('querystring');

//FireBase
var firebase = require('firebase');

firebase.initializeApp({
  databaseURL: 'https://<Firebase db link name>.firebaseio.com',
  serviceAccount: './<Service Account File Name>.json'
});

function Database(){
}

Database.prototype.writeDatabase = function(callback){
	var ref = firebase.database().ref('Alexa');
	var root = firebase.database().ref();
    var x = ref.push();
    x.set({hello: "Blood"});
    root.once("value")
	  .then(function(snapshot) {
	    var childKey = snapshot.child("Alexa/"+x.key).val(); // "ada"
	    console.log(childKey);
	    callback();
	  });
}

module.exports = Database;