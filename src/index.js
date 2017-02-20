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
        var repromptText = moviedb.HELP_TEXT;
        var speechText = moviedb.WELCOME_TEXT + repromptText;
        this.emit(':ask', speechText, repromptText);
    },

    'MovieIntent': function() {
        var self = this;
        var repromptText = moviedb.ASK_AGAIN_TEXT;
        var speechText = "";
        var movie = this.event.request.intent.slots.Movie.value;
        if (!movie) {
            self.emit('Unhandled')
        }
        netflix.title(movie, function(error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', moviedb.SERVER_ERROR_TEXT, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                var actorString = data['show_cast'];
                speechText = movie + " starred: " + actorString + ". " + repromptText;
            } else {
                speechText = "I could not find any actors in my database for " + movie + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'ActorIntent': function() {
        var self = this;
        var repromptText = moviedb.ASK_AGAIN_TEXT;
        var speechText = "";
        var actor = this.event.request.intent.slots.Actor.value;
        if (!actor) {
            self.emit('Unhandled')
        }
        netflix.actor(actor, function(error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', moviedb.SERVER_ERROR_TEXT, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                var movieString = moviedb.extractMovies(data);
                speechText = "Among others, " + actor + " was in: " + movieString + ". " + repromptText;
            } else {
                speechText = "I could not find a movie in my database with " + actor + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },


    'DirectorIntent': function() {
        var self = this;
        var repromptText = moviedb.ASK_AGAIN_TEXT;
        var speechText = "";
        var director = this.event.request.intent.slots.Director.value;
        if (!director) {
            self.emit('Unhandled')
        }
        netflix.director(director, function(error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', moviedb.SERVER_ERROR_TEXT, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                var directorString = moviedb.extractDirected(data);
                speechText = "Among others, " + director + " directed: " + directorString + ". " + repromptText;
            } else {
                speechText = "I could not find any movies in my database by " + director + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'Unhandled': function() {
        var repromptText = "Say 'help' to get a list of commands";// for " + moviedb.APP_NAME;
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

