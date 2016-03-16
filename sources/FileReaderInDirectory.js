'use strict';

var fs = require('fs');

function FileReaderInDirectory(directory) {
    return function(filename) {
        return fs.readFileSync(directory + '/' + filename);
    }
}

module.exports = FileReaderInDirectory;