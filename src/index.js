"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var moviedb = require('./moviedb');
/**
 * Movie Information Lookup App.
 * Make sure the first answer is the correct one. Set at least ANSWER_COUNT answers, any extras will be shuffled in.
 */
var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var netflix = require('netflix-roulette');
// var languageString = moviedb.LANGUAGE_STRING;

var handlers = {
    'LaunchRequest': function () {
        console.log('LaunchRequest');
        var repromptText = moviedb.WELCOME_TEXT;
        var speechText = "" + repromptText;
        this.emit(':ask', speechText, repromptText);
    },

    'MovieIntent': function() {
        var self = this;
        var repromptText = "";
        var speechText = "";
        var movie = this.event.request.intent.slots.Movie.value;
        netflix.title(movie, function(error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', moviedb.SERVER_ERROR_TEXT, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + data);
            repromptText = "";
            // TODO: Format data for speech.
            // speechText = data + repromptText;
            speechText = "success";
            self.emit(':ask', speechText, repromptText);
        });
    },

    'ActorIntent': function() {
        var self = this;
        var repromptText = "";
        var speechText = "";
        var actor = this.event.request.intent.slots.Actor.value;
        netflix.actor(actor, function(error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', actordb.SERVER_ERROR_TEXT, actordb.HELP_TEXT);
                return;
            }
            console.log('data: ' + data);
            repromptText = "";
            // TODO: Format data for speech.
            // speechText = data + repromptText;
            speechText = "success";
            self.emit(':ask', speechText, repromptText);
        });
    },

    'Unhandled': function() {
        var repromptText = "Say 'help' to get a list of commands";
        var speechText = "Sorry, I didn\'t get that. " + repromptText;
        this.emit(':ask', speechText, repromptText);
    },

    'AMAZON.HelpIntent': function () {
        var speechOutput = moviedb.HELP_TEXT;
        var reprompt = moviedb.HELP_TEXT;
        this.emit(':ask', speechOutput, reprompt);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', moviedb.EXIT_TEXT);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', moviedb.EXIT_TEXT);
    },

    'SessionEndedRequest': function () {
        this.attributes['endedSessionCount'] += 1;
        // Save state to dynamo.
        this.emit(':saveState', true);
        console.log('session ended!');
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

