'use strict';
let library = (function () {
    const dateformat = require('dateformat');

    let appName = 'Movie Roulette';
    let welcomeText = "Welcome to " + appName + ". I can give you quick information about your favorite movies, stars, and shows. ";
    // let helpText = "You can say something like 'tell me about actor Leonardo Dicaprio.' Or just say actor, movie, or director " +
    //     "followed by the name - such as 'director Steven Spielberg'.";
    let helpText = "You can say 'actor', 'director', 'movie', or 'show' - followed by the name - such as saying " +
        "'director Steven Spielberg' or 'actor Leonardo Dicaprio.'";
    let exitText = 'Closed ' + appName;
    let noResultsText = "Could not find any results for: ";
    let authErrorText = "There was an authentication issue while retrieving your information, please reinstall " +
        "or re-authenticate the alexa app";
    let askAgainText = "Ask me something else?";
    let serverErrorText = "Could not retrieve information from server. " + askAgainText;

    function sayList(listString) {
        let lastComma = listString.lastIndexOf(',');
        let result = listString;
        if (lastComma > 1) {
            result = listString.substr(0, lastComma) + ', and ' + listString.substr(lastComma + 1);
        }
        return result;
    }

    function extractMovieTitles(response) {
        let movies = [];
        for (let i in response) {
            let r = response[i];
            movies.push(r['show_title'].replace(',', ' '));
        }
        console.log('movies: ' + movies);
        return sayList(movies.join(','));
    }

    function getAverageRatingFromEpisodes(episodes) {
        if (!episodes.length) {
            return 0;
        }

        let rating = 0.0;
        let numReviews = 0;
        for (let i = 0; i < episodes.length; i++) {
            let val = parseFloat(episodes[i].rating) || -1;
            if (val != -1) {
                rating += val;
                numReviews += 1;
                // console.log(rating, val);
            }
            // else {
                // console.log('unparseable rating: ' + episodes[i].rating)
            // }
        }
        let average = rating / numReviews;
        console.log('reviews, reviews with valid rating: ', episodes.length, numReviews);
        return Math.round(average * 10) / 10; // one decimal rounding.
    }

    function parseDateFromEpisode(episode) {
        let epDate = '';

        try {
            epDate = dateformat(episode.released, "mmmm dS, yyyy");
        } catch (e) { // date exception
            epDate = '';
        }

        return epDate;
    }

    return {
        APP_NAME: appName,
        WELCOME_TEXT: welcomeText,
        HELP_TEXT: helpText,
        EXIT_TEXT: exitText,
        AUTH_ERROR_TEXT: authErrorText,
        SERVER_ERROR_TEXT: serverErrorText,
        NO_RESULTS_TEXT: noResultsText,
        ASK_AGAIN_TEXT: askAgainText,
        sayList: sayList,
        getAverageRatingFromEpisodes: getAverageRatingFromEpisodes,
        extractMovieTitles: extractMovieTitles,
        parseDateFromEpisode: parseDateFromEpisode
    };

})();
module.exports = library;
