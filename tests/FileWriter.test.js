'use strict';

var chai = require('chai')
  , fs = require('fs')
  , FileWriter = require('../sources/FileWriter.js');

var expect = chai.expect;

describe('FileWriter', function(){

    var SANDBOX_PATH = './tests/sandbox'
      , PATH = SANDBOX_PATH + '/file'
      , CONTENT = 'dummyContent';

    var writer;

    function cleanUp(PATH) {
        if (fs.existsSync(PATH))
            fs.unlinkSync(PATH);
    }

    function expectFileContentsToEqual(PATH, CONTENT) {
        let result = fs.readFileSync(PATH, 'utf8');
        expect(result).to.be.equal(CONTENT);
    }

    beforeEach(function(){
        cleanUp(PATH);
        writer = new FileWriter();
    });

    afterEach(function(){
        cleanUp(PATH);
    });

    it("should write new file to given path with given content", function() {
        writer.addNewFile(PATH, CONTENT);
        expectFileContentsToEqual(PATH, CONTENT);
    });

    it("should throw error when file already exist during new file addition", function() {
        function addNewFile() { writer.addNewFile(PATH, CONTENT) }
        addNewFile();
        expect(addNewFile).to.throw(/already exists/i);
    });

    it("should write new file when updateFile used with non-existent path", function() {
        writer.updateFile(PATH, CONTENT);
        expectFileContentsToEqual(PATH, CONTENT);
    });

    it("should replace file's content when updateFile used with existent path", function() {
        let newContent = 'some new content';
        writer.updateFile(PATH, CONTENT);
        writer.updateFile(PATH, newContent);
        expectFileContentsToEqual(PATH, newContent);
    });

});