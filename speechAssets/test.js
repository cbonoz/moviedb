/**
 * Created by cbono on 5/31/17.
 */
'use strict';

const imdb = require('imdb-api');
const apiKey = '1fdc329a';

// Promises!
imdb.get('Sidewayfs', {apiKey: apiKey}, (err, data) => {
    if (err) {
        console.log('err: ' + JSON.stringify(err));
        return;
    }
    console.log(JSON.stringify(data));

});

// imdb.get('How I Met Your dsfsfMother', {apiKey: apiKey}).then(things => {
//     things.episodes().then(console.log);
// });
// imdb.getById('tt0090190', {apiKey: apiKey}).then(console.log);
// imdb.getReq({ name: 'The Toxic Avenger', opts: {apiKey: apiKey} }).then(console.log);
