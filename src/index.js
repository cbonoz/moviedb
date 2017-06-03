"use strict";
/**
 * Movie Information Lookup App.
 * Make sure the first answer is the correct one. Set at least ANSWER_COUNT answers, any extras will be shuffled in.
 */
const Alexa = require("alexa-sdk");
// Optional: replace undefined app id with your app ID.
const APP_ID = 'amzn1.ask.skill.24985af4-77a4-489c-9790-79220c8e7b68';
const imdb = require('imdb-api');
const dateformat = require('dateformat');
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
        const self = this;
        const repromptText = moviedb.ASK_AGAIN_TEXT;
        const movie = this.event.request.intent.slots.Movie.value;
        let speechText = "";
        if (!movie) {
            self.emit('Unhandled')
        }
        imdb.get(movie, {apiKey: moviedb.MY_KEY}, (err, data) => {
            if (!data.hasOwnProperty('title')) {
                console.log('err: ' + JSON.stringify(err));
                self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + movie, moviedb.HELP_TEXT);
                return;
            }
            // console.log('data: ' + JSON.stringify(data));
            if (data.hasOwnProperty('actors')) {
                let actorString = moviedb.sayList(data['actors']);
                speechText = movie + " starred: " + actorString; // + ". " + repromptText;
            } else {
                speechText = "I could not find any actors in my database for " + movie; // + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'ActorIntent': function () {
        const self = this;
        const repromptText = moviedb.ASK_AGAIN_TEXT;
        const actor = this.event.request.intent.slots.Actor.value;
        let speechText = "";
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
                let movieString = moviedb.extractMovieTitles(data);
                speechText = "Among others, " + actor + " was in: " + movieString; // + ". " + repromptText;
            } else {
                speechText = "I could not find a movie in my database with " + actor; // + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'DirectorIntent': function () {
        const self = this;
        const repromptText = moviedb.ASK_AGAIN_TEXT;
        const director = this.event.request.intent.slots.Director.value;
        let speechText = "";
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
                let directorString = moviedb.extractMovieTitles(data);
                speechText = "Among others, " + director + " directed: " + directorString; // + ". " + repromptText;
            } else {
                speechText = "I could not find any movies in my database by " + director; // + ". " + repromptText;
            }
            self.emit(':ask', speechText, repromptText);
        });
    },

    'ShowIntent': function () {
        const self = this;
        const repromptText = moviedb.ASK_AGAIN_TEXT;
        const show = this.event.request.intent.slots.Show.value;
        let speechText = "";

        if (!show) {
            console.log('Unhandled in ShowIntent');
            self.emit('Unhandled')
        }

        imdb.get(show, {apiKey: moviedb.MY_KEY}, (err, data) => {
            if (err) {
                console.log('err finding show: ' + JSON.stringify(err));
                self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
                return;
            }
            data.episodes((err, things) => {
                if (!data.hasOwnProperty('title')) {
                    console.log('err getting episodes for show: ' + JSON.stringify(err));
                    self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
                    return;
                }

                let episodes = data._episodes;
                if (episodes.length > 0) {
                    const lastIndex = episodes.length - 1;
                    const seasons = episodes[lastIndex].season;
                    const averageRating = moviedb.getAverageRatingFromEpisodes(episodes);
                    const startDate = dateformat(episodes[0].released, "mmmm dS, yyyy");
                    const endDate = dateformat(episodes[lastIndex].released, "mmmm dS, yyyy");

                    speechText = util.format('%s has %d episodes across %d seasons, from %s to the most recent episode on %s, with an ' +
                        'average rating of ', show, lastIndex + 1, seasons, startDate, endDate, averageRating);
                } else {
                    speechText = "I could not find any episodes in my database for " + show;// + ". " + moviedb.ASK_AGAIN_TEXT;
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

