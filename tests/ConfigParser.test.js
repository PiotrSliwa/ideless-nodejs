'use strict';

var chai = require('chai')
  , spies = require('chai-spies')
  , ConfigParser = require('../sources/ConfigParser.js');

chai.use(spies);

var expect = chai.expect;

describe('ConfigParser', function(){

    let CONFIG_PATH = 'dummyPath';
    let DUMMY_MESSAGE = 'Dummy message';

    function OrderedSpy() {
        let counter = 0;
        let functions = arguments;
        return chai.spy(function() {
            return functions[counter++]();
        });
    }

    it("shall throw error when empty contents given", function(){
        let fileReader = chai.spy();
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(); }
        expect(fn).to.throw(/empty/i);
    });

    it("shall call fileReader with configPath and throw error when fileReader throws", function(){
        let fileReader = chai.spy(function() { throw new Error(DUMMY_MESSAGE); });
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(/cannot open/i);
        expect(fileReader).to.be.called.with(CONFIG_PATH);
    });

    it("shall throw error when invalid JSON given", function(){
        let fileReader = chai.spy(function(){ return 'invalid json'; });
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(/config file error/i);
    });

    it("shall throw error when 'objects' filed is not present in config", function(){
        let fileReader = chai.spy(function() { return '{}'; });
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(/objects/i);
    });

    it("shall throw error when file reader throws", function(){
        let config = '{"objects":{"obj1":{"files":[{"source":"source","target":"target"}]}}}';
        let fileReader = new OrderedSpy(
            function() { return config; },
            function() { throw new Error(DUMMY_MESSAGE); }
        );
        let sut = new ConfigParser(fileReader);

        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(DUMMY_MESSAGE);
    });

    it("shall throw error when object's 'files' is not an array", function(){
        let fileReader = chai.spy(function() { return '{"objects":{"obj1":{"files":{}}}}'; });
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(/array/i);
    });

    it("shall throw error when object's file does not contain source", function(){
        let fileReader = chai.spy(function() { return '{"objects":{"obj1":{"files":[{"target":"target"}]}}}'; });
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(/source/i);
    });

    it("shall throw error when object's file does not contain target", function(){
        let fileReader = chai.spy(function() { return '{"objects":{"obj1":{"files":[{"source":"source"}]}}}'; });
        let sut = new ConfigParser(fileReader);
        function fn() { sut.parse(CONFIG_PATH); }
        expect(fn).to.throw(/target/i);
    });

    it("shall replace object's file contents with the one returned by fileReader", function(){
        let source = 'source'
          , target = 'target';
        let config = '{"objects":{"obj1":{"files":[{"source":"' + source + '","target":"' + target+ '"}]}}}';
        let fileContent = 'file contents';
        let fileReader = new OrderedSpy(
            function() { return config; },
            function() { return fileContent; }
        );
        let sut = new ConfigParser(fileReader);

        let result = sut.parse(config);
        expect(fileReader).to.be.called.with(source);
        expect(result).to.deep.equal({objects: {obj1: {files: [{target: target, data: fileContent}]}}});
    });

});