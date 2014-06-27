define('menu', function(require) {

    // until this is fixed in the library
    var localforage = require('localforage');

    localforage.ready(function() {
        console.log('ready!!');
    });

});