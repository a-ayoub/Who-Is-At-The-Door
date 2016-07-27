var APP_ID = '<Alexa App ID Here>';

var AlexaSkill = require('./AlexaSkill.js');
var Responses = require('./responses.js');
var Database = require('./database.js');

var database = new Database()

//Initiate skill
var whosDoor = function (){
    AlexaSkill.call(this, APP_ID);
}

whosDoor.prototype = Object.create(AlexaSkill.prototype);
whosDoor.prototype.constructor = whosDoor;

whosDoor.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session){
    console.log("WhosAtTheDoor onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: "+ session.sessionId);
    // any initialization logic goes here such as setting up firebase communication
};

whosDoor.prototype.eventHandlers.onLaunch = function (launchRequest, session, response){
    console.log("WhosAtTheDoor onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    // check if anyone is at the door, if the PIR sensor doesn't detect anyone display noOneMessage and loop this process
    // response function goes here from response.js
    initiatePiFacialRecognition(session, response, function(){
        var speechResponse = Responses.launchRecognized("John")
        response.ask(speechResponse.speechOutput, speechResponse.repromptText)
    });
};

whosDoor.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session){
    console.log("WhosAtTheDoor onSessionEnded requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    // cleanup logic goes here such as closing firebase communication
}

whosDoor.prototype.intentHandlers = {
    // custom intent handlers handled here
    "DoorIntent": function(intent, session, response){
        initiatePiFacialRecognition(session, response, function(){
            var speechResponse = Responses.launchRecognized("John")
            response.ask(speechResponse.speechOutput, speechResponse.repromptText)
        });
    }

};

function initiatePiFacialRecognition(session, response, piCallback){
    database.writeDatabase(function(){
        piCallback();
    });
    // databasePush.on("child_added", function(snap) {
    //     console.log("initial data loaded!", snap.key +":",snap.val());
    //     piCallback();
    // });
}

// Lambda function:
exports.handler = function (event, context) {
    var door = new whosDoor();
    door.execute(event,context);
};
