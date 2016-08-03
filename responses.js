/*  Alexa Voice Interaction speech assets - each function is a response Alexa makes to user based on user's position in application
as shown in the VUI  */

module.exports = {  													
	PIRRepromptText: " I don't see anyone out there",					
	exitText: " Okay, the person at the door will not be trained.",		
	noTrainText: " Could not train person.",							
	/* Response if person at door is recognized */
	launchRecognized : function(name){											
		var speechOutput = name + " is at the door. " +
		"Would you like me to get to know them better? "

		var repromptText = "Would you like me to get to know them better? "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	},
	/* Response if person at door is not recognized */
	failRecognize : function(){
		var speechOutput = "I can't seem to recognize who is at the door. "+
		"Would you like me to take a picture of them? "

		var repromptText = "Would you like me to take a picture of them? "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	},
	/* Response when user wants to take a picture of the unknown person at their door to train them */
	setNameIntent : function(){
		var speechOutput = "Okay, now that I know what they look like, please set a name for them. "

		var repromptText = "Please set a name for them. "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	},
	/* Response when a person's face is trained */
	finishTrainIntent : function(name){
		var speechOutput = "I now know "+name+" better. "
		var repromptText = "I now know "+name+" better. "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	}
};