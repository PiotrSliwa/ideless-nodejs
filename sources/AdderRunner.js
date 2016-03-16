'use strict';

var Adder = require('./Adder.js');
var AddActionsGenerator = require('./AddActionsGenerator.js');
var argv = require('optimist').argv;

function AdderRunner(fileWriter, config) {

    this.run = run;

    let addActionsGenerator = new AddActionsGenerator(config);
    let adder = new Adder(fileWriter, addActionsGenerator);

    function run() {
        let objectName = argv._[1];
        adder.add(objectName);
    }
}

module.exports = AdderRunner;