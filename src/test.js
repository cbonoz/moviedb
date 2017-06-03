/**
 * Created by cbono on 5/31/17.
 */
'use strict';

const imdb = require('imdb-api');
const moviedb = require('./moviedb');
const dateformat = require('dateformat');
const util = require('util');
const apiKey = '1fdc329a';

// let show = 'suits';
// let movie = 'jurassic park';

// Promises!
// imdb.get('Sidewayfs', {apiKey: apiKey}, (err, data) => {
//     if (err) {
//         console.log('err: ' + JSON.stringify(err));
//         return;
//     }
//     console.log(JSON.stringify(data));
//
// });

// imdb.get('How I Met Your dsfsfMother', {apiKey: apiKey}).then(things => {
//     things.episodes().then(console.log);
// });
// imdb.getById('tt0090190', {apiKey: apiKey}).then(console.log);
// imdb.getReq({ name: 'The Toxic Avenger', opts: {apiKey: apiKey} }).then(console.log);

// imdb.get(show, {apiKey: moviedb.MY_KEY}, (err, data) => {
//     if (err) {
//         console.log('err level 1: ' + JSON.stringify(err));
//         return;
//     }
//
//     let speechText;
//     data.episodes((err, things) => {
//         if (!data.hasOwnProperty('title')) {
//             console.log('err level 2: ', JSON.stringify(err), "data: ", JSON.stringify(data));
//             // self.emit(':ask', err.message || moviedb.NO_RESULTS_TEXT + show, moviedb.HELP_TEXT);
//             return;
//         }
//         let episodes = data._episodes;
//         if (episodes.length > 0) {
//             // console.log('episodes: ' + JSON.stringify(episodes));
//             const lastIndex = episodes.length - 1;
//             const seasons = episodes[lastIndex].season;
//             const averageRating = moviedb.getAverageRatingFromEpisodes(episodes);
//             const startDate = dateformat(episodes[0].released, "mmmm dS, yyyy");
//             const endDate = dateformat(episodes[lastIndex].released, "mmmm dS, yyyy");
//
//             speechText = util.format('%s has %d episodes across %d seasons, from %s to the most recent episode on %s, with an ' +
//                 'average rating of %f', show, lastIndex + 1, seasons, startDate, endDate, averageRating);
//         } else {
//             speechText = "I could not find any episodes in my database for " + show + ". " + moviedb.ASK_AGAIN_TEXT;
//         }
//         // self.emit(':ask', speechText, repromptText);
//         console.log('speechtext: ' + JSON.stringify(speechText))
//     });
// });
//
// imdb.get(movie, {apiKey: moviedb.MY_KEY}, (err, data) => {
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