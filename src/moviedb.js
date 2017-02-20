var library = (function () {

    var appName = 'Movie Roulette';
    var welcomeText = "Welcome to " + appName;
    var helpText = "You can say something like 'tell me about actor Leonardo Dicaprio.' Or just say actor, movie, or director " +
        "followed by the name - such as 'director Steven Spielberg'.";
    var exitText = 'Closed ' + appName;
    var serverErrorText = "Could not retrieve information from server.";
    var authErrorText = "There was an authentication issue while retrieving your information, please reinstall " +
        "or re-authenticate the alexa app";
    var askAgainText = "What next?";

    function extractMovies(response) {
        var movies = [];
        for (var i in response) {
            var r = response[i];
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
        var movies = [];
        for (var i in response) {
            var r = response[i];
            movies.push(r['show_title']);
        }
        console.log('movies: ' + movies);
        if (movies.length) {
            return movies.join(", ");
        } else {
            return "";
        }
    }

    // function extractActors(response) {
    //     var actors = [];
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
        ASK_AGAIN_TEXT: askAgainText,
        extractMovies: extractMovies,
        extractDirected: extractDirected
    };

})();
module.exports = library;
