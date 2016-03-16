'use strict';

var fs = require('fs');

function FileWriter() {

    this.addNewFile = addNewFile;
    this.updateFile = updateFile;

    function addNewFile(path, content) {
        if (fs.existsSync(path))
            throw new Error('Error: ' + path + ' already exists!');
        fs.writeFileSync(path, content);
    }

    function updateFile(path, content) {
        fs.writeFileSync(path, content);
    }

}

module.exports = FileWriter;