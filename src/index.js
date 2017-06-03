"use strict";
/**
 * Movie Information Lookup App.
 * Make sure the first answer is the correct one. Set at least ANSWER_COUNT answers, any extras will be shuffled in.
 */
const Alexa = require("alexa-sdk");
// Optional: replace undefined app id with your app ID.
const APP_ID = undefined;
const imdb = require('imdb-api');
const util = require('util');
const moviedb = require('./moviedb');
const netflix = require('netflix-roulette');
// let languageString = moviedb.LANGUAGE_STRING;

let handlers = {
    'LaunchRequest': function () {
        console.log('LaunchRequest');
        let repromptText = moviedb.HELP_TEXT;
        let speechText = moviedb.WELCOME_TEXT + repromptText;
        this.emit(':ask', speechText, repromptText);
    },

    'MovieIntent': function () {
        let self = this;
        let repromptText = moviedb.ASK_AGAIN_TEXT;
        let speechText = "";
        let movie = this.event.request.intent.slots.Movie.value;
        if (!movie) {
            self.emit('Unhandled')
        }
        imdb.get(movie, {apiKey: moviedb.MY_KEY}, (err, data) => {
            if (err) {
                console.log('err: ' + JSON.stringify(err));
                self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + movie, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + JSON.stringify(data));
            if (data.hasOwnProperty('actors')) {
                let actorString = data['actors'];
                speechText = movie + " starred: " + actorString + ". " + repromptText;
            } else {
                speechText = "I could not find any actors in my database for " + movie + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'ActorIntent': function () {
        let self = this;
        let repromptText = moviedb.ASK_AGAIN_TEXT;
        let speechText = "";
        let actor = this.event.request.intent.slots.Actor.value;
        if (!actor) {
            self.emit('Unhandled')
        }
        netflix.actor(actor, function (error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', moviedb.SERVER_ERROR_TEXT, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                let movieString = moviedb.extractMovies(data);
                speechText = "Among others, " + actor + " was in: " + movieString + ". " + repromptText;
            } else {
                speechText = "I could not find a movie in my database with " + actor + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'DirectorIntent': function () {
        let self = this;
        let repromptText = moviedb.ASK_AGAIN_TEXT;
        let speechText = "";
        let director = this.event.request.intent.slots.Director.value;
        if (!director) {
            self.emit('Unhandled')
        }
        netflix.director(director, function (error, data) {
            console.log('error: ' + error);
            if (error) {
                self.emit(':ask', moviedb.SERVER_ERROR_TEXT, moviedb.HELP_TEXT);
                return;
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                let directorString = moviedb.extractDirected(data);
                speechText = "Among others, " + director + " directed: " + directorString + ". " + repromptText;
            } else {
                speechText = "I could not find any movies in my database by " + director + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'ShowIntent': function () {
        let self = this;
        let repromptText = moviedb.ASK_AGAIN_TEXT;
        let speechText = "";
        let show = this.event.request.intent.slots.show.value;
        if (!show) {
            self.emit('Unhandled')
        }
        imdb.get(show, {apiKey: moviedb.MY_KEY}, (err, data) => {
            if (err) {
                console.log('err: ' + JSON.stringify(err));
                self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
                return;
            }
            data.episodes((err, episodes) => {
                if (err) {
                    console.log('err: ' + JSON.stringify(err));
                    self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
                    return;
                }
                if (data.length > 0) {
                    console.log('episodes: ' + JSON.stringify(episodes));
                    const lastIndex = data.length-1;

                    let startDate = dateFormat(data[0].released, "UTC:h:MM:ss TT Z");
                    let endDate = dateFormat(data[lastIndex].released, "UTC:h:MM:ss TT Z");
                    speechText = util.format('%s has %d episodes across %d seasons, starting on %s up to %s, with an ' +
                        'average rating of %.1f', show, lastIndex + 1, startDate, endDate,
                        moviedb.getAverageRatingFromEpisodes(episodes))
                } else {
                    speechText = "I could not find any episodes in my database for " + show + ". " + repromptText;
                }
                self.emit(':ask', speechText, repromptText);
            });
        });
    },

    'Unhandled': function () {
        let repromptText = "Say 'help' to get a list of commands";// for " + moviedb.APP_NAME;
        let speechText = "Sorry, I didn\'t get that. " + repromptText;
        this.emit(':ask', speechText, repromptText);
    },

    'AMAZON.HelpIntent': function () {
        let speechOutput = moviedb.HELP_TEXT;
        let reprompt = moviedb.HELP_TEXT;
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

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageString;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

