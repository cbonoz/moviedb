"use strict";
/**
 * Movie Roulette. Movie Information Lookup Alexa App.
 */
const Alexa = require("alexa-sdk");
const APP_ID = 'amzn1.ask.skill.24985af4-77a4-489c-9790-79220c8e7b68';
const imdb = require('imdb-api');
const util = require('util');
const netflix = require('netflix-roulette');

// My libraries.
const auth = require('./auth');
const moviedb = require('./moviedb');
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
        imdb.get(movie, {apiKey: auth.IMDB_KEY}, (err, data) => {
            if (data == undefined || err != undefined) {
                console.log('err: ' + JSON.stringify(err));
                self.emit(':ask', moviedb.NO_RESULTS_TEXT + movie, moviedb.HELP_TEXT);
            }
            // console.log('data: ' + JSON.stringify(data));
            if (data.hasOwnProperty('actors')) {
                const releaseDate = dateformat(data.released, "mmmm dS, yyyy") || '';
                const director = data.director || '';
                const actorString = moviedb.sayList(data['actors']) || '';
                const rating = data.rating || '';

                speechText = util.format('%s was released on %s by director %s, starring %s. ' +
                    'It\'s average user rating was: %s', movie, releaseDate, director, actorString, rating);
                self.emit(':tell', speechText);
            } else {
                speechText = "I could not find a movie in my database matching " + movie + ". " + repromptText;
                self.emit(':ask', speechText, repromptText);
            }
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
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                let movieString = moviedb.extractMovieTitles(data);
                speechText = "Among other films, " + actor + " was in: " + movieString; // + ". " + repromptText;
                self.emit(':tell', speechText);
            } else {
                speechText = "I could not find a actor in my database matching " + actor + ". " + repromptText;
                self.emit(':ask', speechText, repromptText);
            }
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
            }
            console.log('data: ' + JSON.stringify(data));
            if (!data.hasOwnProperty("message")) {
                let directorString = moviedb.extractMovieTitles(data);
                speechText = "Among other films, " + director + " directed: " + directorString; // + ". " + repromptText;
                self.emit(':tell', speechText);
            } else {
                speechText = "I could not find a director in my database matching " + director + ". " + repromptText;
                self.emit(':ask', speechText, repromptText);
            }
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

        imdb.get(show, {apiKey: auth.IMDB_KEY}, (err, data) => {
            if (data == undefined || err != undefined) {
                console.log('err finding show: ' + JSON.stringify(err));
                self.emit(':ask', moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
            }
            data.episodes((err, things) => {
                if (!data.hasOwnProperty('title')) {
                    console.log('err getting episodes for show: ' + JSON.stringify(err));
                    self.emit(':ask', moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
                }

                let episodes = data._episodes;
                if (episodes.length > 0) {
                    const lastIndex = episodes.length - 1;
                    const seasons = episodes[lastIndex].season || 'a number of';
                    const averageRating = moviedb.getAverageRatingFromEpisodes(episodes);
                    let startDate = '';
                    let endDate = '';

                    let i = 0;
                    while (startDate === '' && i < episodes.length) {
                        startDate = moviedb.parseDateFromEpisode(episodes[i]);
                        i += 1
                    }
                    i = lastIndex;
                    while (endDate === '' && i >= 0) {
                        endDate = moviedb.parseDateFromEpisode(episodes[i]);
                        i -= 1
                    }

                    speechText = util.format('%s has %d episodes across %s seasons, from %s to a most recent episode on %s, with an ' +
                        'average rating of %s.', show, lastIndex + 1, seasons, startDate, endDate, averageRating);
                    self.emit(':tell', speechText);
                } else {
                    speechText = "I could not find any entries in my database matching the show " + show + ". " + repromptText;
                    self.emit(':ask', speechText, repromptText);
                }

            });
        });
    },

    'Unhandled': function () {
        let repromptText = "Say 'help' to get a list of commands";
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

