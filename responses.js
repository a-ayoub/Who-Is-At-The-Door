module.exports = {
	PIRRepromptText: " I don't see anyone out there",
	exitText: " Okay, the person at the door will not be trained.",
	noTrainText: " Could not train person.",

	launchRecognized : function(name){
		var speechOutput = name + " is at the door. " +
		"Would you like me to get to know them better? "

		var repromptText = "Would you like me to get to know them better? "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	},
	failRecognize : function(){
		var speechOutput = "I can't seem to recognize who is at the door. "+
		"Would you like me to take a picture of them? "

		var repromptText = "Would you like me to take a picture of them? "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	},
	setNameIntent : function(){
		var speechOutput = "Okay, now that I know what they look like, please set a name for them. "

		var repromptText = "Please set a name for them. "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	},
	finishTrainIntent : function(name){
		var speechOutput = "I now know "+name+" better. "
		var repromptText = "I now know "+name+" better. "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	}
};