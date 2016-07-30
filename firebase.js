var request = require('request');
var firebase = require('firebase');

const spawn = require('child_process').spawn;
const fs = require('fs');

var photoNum = 0;

firebase.initializeApp({
  databaseURL: 'https://whos-at-the-door-bd527.firebaseio.com',
  serviceAccount: './Who\'s\ At\ The\ Door-524db9c73091.json'
});


var ref = firebase.database().ref("Alexa");

ref.on("child_changed", function(snap) {
  console.log("initial data loaded!", snap.key +":",snap.val());
  if(snap.val() == 'callFacialRecog'){
  	//add PIR logic here, if fails, send fail message to database, or else callback to below

  	//add take image logic here, callback to the below request
    const Raspistill = spawn('raspistill',['-e','jpg','-o','./photo/image-'+(++photoNum)+'.jpg']);
    Raspistill.on('close', (code) => {
      var name = './photo/image-'+photoNum+'.jpg';
      fs.readFile(name, function(err, data) {
         var base64data = new Buffer(data).toString('base64');
         console.log(base64data);
         var options = {
          url: 'https://api.kairos.com/recognize',
          headers:{
            'Content-Type': 'application/json',
            'app_id': '013361a9',
            'app_key': '99d2e27522444ed77016ace28603b91a'
          },
          body: JSON.stringify({
            image: base64data, 
            gallery_name: 'alexaTest'
          })
        };
        request.post(options,function(error, response, body){
          if(error){
            ref.child("Read").set("Failed");
          }
          else{
            var status = JSON.parse(body)["images"][0]["transaction"]["status"];
            if(status == "success"){
              var name = 'doneRecog '+JSON.parse(body)["images"][0]["transaction"]["subject"];
              ref.child("Read").set(name);
            }
            else if (status == "failure"){
              ref.child("Read").set("Failed");
            }
          }
        });
      });
    });
  }
});
