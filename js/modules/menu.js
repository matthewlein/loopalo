define('menu', function(require) {

    var localforage = require('localforage');

    localforage.ready(function() {
        console.log('ready!!');
    });

});