var request = require('request');
var firebase = require('firebase');

firebase.initializeApp({
  databaseURL: 'https://whos-at-the-door-bd527.firebaseio.com',
  serviceAccount: './Who\'s\ At\ The\ Door-524db9c73091.json'
});

var options = {
	url: 'https://api.kairos.com/recognize',
	headers:{
		'Content-Type': 'application/json',
		'app_id': '013361a9',
		'app_key': '99d2e27522444ed77016ace28603b91a'
	},
	body: JSON.stringify({
		image: 'https://upload.wikimedia.org/wikipedia/commons/6/68/Dwayne_Johnson_at_the_2009_Tribeca_Film_Festival.jpg', 
		gallery_name: 'alexaTest'
	})
};

var ref = firebase.database().ref("Alexa");
// ref.once("value")
//   .then(function(snapshot) {
//     var childKey = snapshot.child("Alexa/Write").val(); // "ada"
//     console.log(childKey);
//   });
// firebase.database().ref("Alexa/Write").set("Hello");
// var x = ref.push();
// x.set({hello: "World"});

ref.on("child_added", function(snap) {
  console.log("initial data loaded!", snap.key +":",snap.val());
  if(snap.child("Write").val() == 'callFacialRecog'){
  	//add PIR logic here, if fails, send fail message to database, or else callback to below

  	//add take image logic here, callback to the below request
  	request.post(options,function(error, response, body){
  		if(error){
  			ref.push().set({Read: "Failed"});
  		}
  		else{
  			var status = JSON.parse(body)["images"][0]["transaction"]["status"];
  			if(status == "success"){
  				var name = 'doneRecog '+JSON.parse(body)["images"][0]["transaction"]["subject"];
	  			ref.push().set({ Read: name});
  			}
  			else if (status == "failure"){
  				ref.push().set({Read: "Failed"});
  			}
  		}
	});
  }
});
// var x = red.push()
// x.set({ first: "World", age: 22 });
// console.log(x.key);

// red.on("child_added", function(snap) {
//   console.log("added:", snap.key);
// });
  // .then(function() {
  //  return red.once("value");
  // })
  // .then(function(snapshot) {
  //   var data = snapshot.val();
  //   console.log(data);
  // });