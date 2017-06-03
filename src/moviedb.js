'use strict';
let library = (function () {

    let appName = 'Movie Roulette';
    let welcomeText = "Welcome to " + appName;
    // let helpText = "You can say something like 'tell me about actor Leonardo Dicaprio.' Or just say actor, movie, or director " +
    //     "followed by the name - such as 'director Steven Spielberg'.";
    let helpText = "You can say 'actor', 'director', 'movie', or 'show' followed by the name - such as " +
        "'director Steven Spielberg' or 'actor Leonardo Dicaprio.'";
    let exitText = 'Closed ' + appName;
    let serverErrorText = "Could not retrieve information from server.";
    let noResultsText = "Could not find any results for: ";
    let authErrorText = "There was an authentication issue while retrieving your information, please reinstall " +
        "or re-authenticate the alexa app";
    let askAgainText = "What next?";
    let openKey = '1fdc329a';

    function extractMovies(response) {
        let movies = [];
        for (let i in response) {
            let r = response[i];
            movies.push(r['show_title']);
        }
        console.log('movies: ' + movies);
        if (movies.length) {
            return movies.join(", ");
        } else {
            return "";
        }
    }

    function extractDirected(response) {
        let movies = [];
        for (let i in response) {
            let r = response[i];
            movies.push(r['show_title']);
        }
        console.log('movies: ' + movies);
        if (movies.length) {
            return movies.join(", ");
        } else {
            return "";
        }
    }

    function getAverageRatingFromEpisodes(episodes) {
        const numEpisodes = episodes.length;
        if (!numEpisodes) {
            return 0;
        }
        let rating = 0;
        episodes.map((episode) => rating += parseFloat(episode.rating));
        return rating / numEpisodes;
    }

    // function extractActors(response) {
    //     let actors = [];
    //
    //     return actors.join(", ");
    // }

    return {
        APP_NAME: appName,
        WELCOME_TEXT: welcomeText,
        HELP_TEXT: helpText,
        EXIT_TEXT: exitText,
        AUTH_ERROR_TEXT: authErrorText,
        SERVER_ERROR_TEXT: serverErrorText,
        NO_RESULTS_TEXT: noResultsText,
        ASK_AGAIN_TEXT: askAgainText,
        MY_KEY: openKey,
        getAverageRatingFromEpisodes: getAverageRatingFromEpisodes,
        extractMovies: extractMovies,
        extractDirected: extractDirected
    };

})();
module.exports = library;
