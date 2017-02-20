var library = (function () {

    var appName = 'Movie DB';
    var welcomeText = "Welcome to " + appName;
    var helpText = "You can say: tell me about actor 'Leonardo Dicaprio', or tell me about actress 'Amy Adams'. " +
        "You can also ask me about movies. Say who starred in 'Jurassic Park'?";
    var exitText = 'Closed ' + appName;
    var serverErrorText = "Could not retrieve information from server.";
    var authErrorText = "There was an authentication issue while retrieving your information, please reinstall " +
        "or re-authenticate the alexa app";

    return {
        yesterdayAtFive: yesterdayAtFive,
        APP_NAME: appName,
        WELCOME_TEXT: welcomeText,
        HELP_TEXT: helpText,
        EXIT_TEXT: exitText,
        AUTH_ERROR_TEXT: authErrorText,
        SERVER_ERROR_TEXT: serverErrorText
    };

})();
module.exports = library;
