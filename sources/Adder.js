'use strict';

function Adder(fileWriter, actionGenerator) {

    this.add = add;

    function add(objectName) {
        if (!objectName)
            throw new Error('Adder cannot file an objectName!');
        let actions = actionGenerator(objectName);
        actions.forEach((action) => {
            fileWriter(action.target, action.data);
        });
    }

}

module.exports = Adder;