# Movie Roulette - Alexa Skill Code Repository
 ---
Database of movie facts and trivia using a combination of the NeflixRoulette API (http://netflixroulette.net/api/) 
and the unofficial IMDB movie API (https://github.com/worr/node-imdb-api).

Don't remember where you saw that actor or actress? Need up to date information
on the latest shows and movies?

Movie Roulette is a simple and easy to use database of movie facts and actor/director information. Find movies associated with a given director/actor. Find actors associated with a given movie. 

Simply say actor/director/movie followed by the name. Not all movies, actors, or directors may be present - information limited to data provided by the Netflix Roulette
and unofficial IMDB api data services.
### Example Conversation:

**You**: Alexa, ask movie roulette for director Steven Spielberg.

**Alexa**: Among others, Steven Spielberg directed: Hook, Close Encounters of the Third Kind: 30th Anniversary Ultimate Edition, Amistad, The Adventures of Tintin, 1941. What next?

**You**: movie Gladiator. 

**Alexa**: Gladiator was released on May 5th, 2000 by director Ridley Scott, starring Russell Crowe, Joaquin Phoenix, Connie Nielsen, and  Oliver Reed. It's average user rating was: 8.5 

**You**: Show Silicon Valley

**Alexa**: Silicon Valley has 37 episodes across 4 seasons, from April 6th, 2014 to the most recent episode on June 18th, 2017, with an average rating of  7.5

**You**: Alexa, cancel

**Alexa**: Exited Movie Roulette


###  Dev Notes:
* You're going to need your own node imdb api key (see above github link) if you want to test/use this application externally.
You can either add this key to a module called ./src/auth.js as used in the code, or you can replace its usage in index.js.
* Zip instructions for aws submission (run from /src): zip -r -X ../src.zip *
* Video here : https://vimeo.com/204956725


