module.exports = {
	PIRRepromptText: " I don't see anyone out there, would you like to check again?",
	trainRepromptText: " Would you like me to get to know them better?",

	launchRecognized : function(name){
		var speechOutput = name + " is at the door. " +
		"Would you like me to get to know them better? "

		var repromptText = "Would you like me to get to know them better? "

		return {
			speechOutput : speechOutput,
			repromptText : repromptText
		}
	}
};