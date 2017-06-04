/**
 * Created by cbono on 5/31/17.
 */
'use strict';

const imdb = require('imdb-api');
const moviedb = require('./moviedb');
const dateformat = require('dateformat');
const util = require('util');
const netflix = require('netflix-roulette');
const auth = require('./auth');

const apiKey = auth.IMDB_KEY;

let actor = 'Herbert Rudley';
let show = 'game of thrones';
let movie = 'jurassic park';
let director = 'michael bay';

// Promises!
imdb.get(movie, {apiKey: apiKey}, (err, data) => {
    if (err) {
        console.log('err: ' + JSON.stringify(err));
        return;
    }
    console.log(JSON.stringify(data));

});
netflix.director(director, function (error, data) {
    if (error) {
        console.log('error: ' + error);
    }
    let speechText = "";
    console.log('data: ' + JSON.stringify(data));
    if (!data.hasOwnProperty("message")) {
        let directorString = moviedb.extractMovieTitles(data);
        speechText = "Among others, " + director + " directed: " + directorString;
    } else {
        speechText = "I could not find a director in my database matching " + director;
    }
    console.log('speechText: ' + speechText);
});

netflix.actor(actor, function (error, data) {
    if (error) {
        console.log('error: ' + error);
    }
    let speechText = '';
    if (!data.hasOwnProperty("message")) {
        let movieString = moviedb.extractMovieTitles(data);
        speechText = "Among others, " + actor + " was in: " + movieString; // + ". " + repromptText;
    } else {
        speechText = "I could not find a actor in my database matching " + actor;
    }
    console.log('speechText: ' + speechText);
});

imdb.get(show, {apiKey: auth.IMDB_KEY}, (err, data) => {
    if (err) {
        console.log('err level 1: ' + JSON.stringify(err));
        return;
    }

    let speechText;
    data.episodes((err, things) => {
        if (!data.hasOwnProperty('title')) {
            console.log('err level 2: ', JSON.stringify(err), "data: ", JSON.stringify(data));
            // self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
            return;
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
        } else {
            speechText = "I could not find any episodes in my database for " + show + ". " + moviedb.ASK_AGAIN_TEXT;
        }
        // self.emit(':ask', speechText, repromptText);
        console.log('speechtext: ' + JSON.stringify(speechText))
    });
});

// imdb.get('How I Met Your dsfsfMother', {apiKey: apiKey}).then(things => {
//     things.episodes().then(console.log);
// });
// imdb.getById('tt0090190', {apiKey: apiKey}).then(console.log);
// imdb.getReq({ name: 'The Toxic Avenger', opts: {apiKey: apiKey} }).then(console.log);
//
// imdb.get(movie, {apiKey: moviedb.IMDB_KEY}, (err, data) => {
//     if (!data.hasOwnProperty('title')) {
//         console.log('err: ' + JSON.stringify(err));
//         // self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + movie, moviedb.HELP_TEXT);
//         return;
//     }
//     let speechText;
//     console.log('data: ' + JSON.stringify(data));
//     if (data.hasOwnProperty('actors')) {
//         let actorString = data['actors'];
//         speechText = movie + " starred: " + actorString + ". " + moviedb.ASK_AGAIN_TEXT;
//     } else {
//         speechText = "I could not find any actors in my database for " + movie + ". " + moviedb.ASK_AGAIN_TEXT;
//     }
//     console.log(moviedb.sayList(speechText));
// });