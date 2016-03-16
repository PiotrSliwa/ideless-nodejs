'use strict';

function ConfigParser(configFileReader) {

    this.parse = parse;

    function parse(configFile) {
        let contents = getConfigContents(configFile);
        try {
            var obj = JSON.parse(contents);
            assertParametersExist(obj, ['objects']);
        }
        catch (err) {
            throw new Error('Config file error: ' + err);
        }
        return replaceFilesWithContents(obj);
    }

    function getConfigContents(path) {
        try {
            var contents = configFileReader(path);
        }
        catch (err) {
            throw new Error('Cannot open config file: ' + path);
        }
        if (!contents)
            throw new Error('Config file cannot be empty!');
        return contents;
    }

    function replaceFilesWithContents(configObject) {
        let result = configObject;
        replaceObjectsFilesWithContents(result);
        return result
    }

    function replaceObjectsFilesWithContents(configObject) {
        for (let objectName in configObject.objects) {
            let object = configObject.objects[objectName];
            if (!object.hasOwnProperty('files'))
                continue;
            if (!Array.isArray(object.files))
                throw new Error("Object's files must be an array!");
            object.files = object.files.map((file) => {
                assertParametersExist(file, ['source', 'target']);
                return {
                    data: configFileReader(file.source),
                    target: file.target
                };
            });
        }
    }

    function assertParametersExist(obj, params) {
        params.forEach((param) => {
            if (!obj.hasOwnProperty(param))
                throw new Error("Lack of '" + param + "' parameter in " + JSON.stringify(obj) + " !");
        });
    }
}

module.exports = ConfigParser;