var APP_ID = 'amzn1.echo-sdk-ams.app.611b37cd-2e37-433f-b70b-5f7b69c9c99f';

var AlexaSkill = require('./AlexaSkill.js');
var Responses = require('./responses.js');
var Database = require('./database.js');

var database = new Database()

var AskIntent = {
  INIT: 1,
  RECOGNIZE: 2,
  NO_RECOGNIZE: 3,
}; 

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
    initiatePiFacialRecognition(session, response, function(name){
        if(name == "noRecognize"){
            setNoRecognizeIntent(session)
            var speechResponse = Responses.failRecognize()
            response.ask(speechResponse.speechOutput, speechResponse.repromptText)
        }
        else{
            setRecognizeIntent(session)
            setSessionName(session,name)
            var speechResponse = Responses.launchRecognized(name)
            response.ask(speechResponse.speechOutput, speechResponse.repromptText)
        }
    });
};

whosDoor.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session){
    console.log("WhosAtTheDoor onSessionEnded requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    // cleanup logic goes here such as closing firebase communication
}

whosDoor.prototype.intentHandlers = {
    // custom intent handlers handled here
    "DoorIntent": function(intent, session, response){
        initiatePiFacialRecognition(session, response, function(name){
            if(name == "noRecognize"){
                setNoRecognizeIntent(session)
                var speechResponse = Responses.failRecognize()
                response.ask(speechResponse.speechOutput, speechResponse.repromptText)
            }
            else{
                setRecognizeIntent(session)
                setSessionName(session,name)
                var speechResponse = Responses.launchRecognized(name)
                response.ask(speechResponse.speechOutput, speechResponse.repromptText)
            }
        });
    },

    "AMAZON.YesIntent": function(intent, session, response){
        switch(session.attributes.AskIntentStatus) {
            case AskIntent.RECOGNIZE:
                initiatePiFacialTraining(session, response, function(){
                    var speechResponse = Responses.finishTrainIntent(session.attributes.NameRecognition)
                    response.ask(speechResponse.speechOutput, speechResponse.repromptText)
                });
                break
            case AskIntent.NO_RECOGNIZE:
                //take a picture of person right here
                var speechResponse = Responses.setNameIntent()
                response.ask(speechResponse.speechOutput, speechResponse.repromptText)
                break
            default:
                console.log("ERROR: Unable to determine yes response")
                response.tell(Responses.exitRepromptText);
                break
        }
    },
    "SetNameIntent": function(intent, session, response){
        var name = intent.slots.UserFirstName.value;
        var speechResponse = Responses.finishTrainIntent(name)
        response.ask(speechResponse.speechOutput, speechResponse.repromptText)
    },
    "AMAZON.NoIntent": function (intent, session, response) {
        response.tell(Responses.exitText);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        response.tell(Responses.exitText);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        response.tell(Responses.exitText);
    }

};

function setRecognizeIntent(session){
    session.attributes.AskIntentStatus = AskIntent.RECOGNIZE
}

function setNoRecognizeIntent(session){
    session.attributes.AskIntentStatus = AskIntent.NO_RECOGNIZE
}

function setSessionName(session, name){
    session.attributes.NameRecognition = name;
}

function initiatePiFacialRecognition(session, response, piCallback){
    database.writeDatabase(function(name){
        piCallback(name);
    });
}
function initiatePiFacialTraining(session, response, piCallback){
    database.trainFaceCall(function(){
        piCallback();
    });
}

// Lambda function:
exports.handler = function (event, context) {
    var door = new whosDoor();
    door.execute(event,context);
};
