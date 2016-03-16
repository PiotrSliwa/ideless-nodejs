'use strict';

function AddActionsGenerator(config) {

    if (!config || !config.objects)
        throw new Error('Given config ' + config + ' is not valid!');

    function generate(objectName) {
        let objects = config.objects;
        if (!objects || !objects.hasOwnProperty(objectName))
            throw new Error('Config does not contain "' + objectName + '" object.')
        return objects[objectName].files;
    }

    return generate;
}

module.exports = AddActionsGenerator;