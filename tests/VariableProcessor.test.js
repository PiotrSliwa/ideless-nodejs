'use strict';

var chai = require('chai')
  , VariableProcessor = require('../sources/VariableProcessor.js');

var expect = chai.expect;

describe('VariableProcessor', function(){

    var processor;

    var VARIABLES = {
        stringVar: 'someString',
        arrayVar: ['elem1','elem2'],
        objectVar: {'key':'value'}
    }

    beforeEach(function(){
        processor = new VariableProcessor(VARIABLES);
    });

    it("should leave non-variable expression by itself", function(){
        let nonVar ='nonVariableExpression'
          , result = processor.process(nonVar);
        expect(result).to.be.equal(nonVar);
    });

    it("should throw error when unexisting variable given", function(){
        function process() { processor.process('$unknownVariable') }
        expect(process).to.throw(/does not exist/i);
    });

    it("should replace existing string variable", function() {
        let result = processor.process('$stringVar');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.stringVar));
    });

    it("should replace existing array variable", function() {
        let result = processor.process('$arrayVar');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.arrayVar));
    });

    it("should replace existing array's element variable", function() {
        let result = processor.process('$arrayVar[1]');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.arrayVar[1]));
    });

    it("should replace existing object variable", function() {
        let result = processor.process('$objectVar');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.objectVar));
    });

    it("should replace existing object's element variable (dot notation)", function() {
        let result = processor.process('$objectVar.key');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.objectVar.key));
    });

    it("should replace existing object's element variable (brace notation)", function() {
        let result = processor.process('$objectVar["key"]');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.objectVar.key));
    });

    it("should replace multiple variables", function(){
        let result = processor.process('$stringVar / $objectVar["key"]');
        expect(result).to.be.equal(JSON.stringify(VARIABLES.stringVar) + ' / ' + JSON.stringify(VARIABLES.objectVar.key));
    });

    it("should throw error when 'this' scoped variable does not exist", function(){
        let param ='$this'
        function process() { processor.process(param) }
        expect(process).to.throw(/does not exist/i);
    });

    it("should replace 'this' scoped string variable (scope is string)", function(){
        let scopedVar = 'dummyString';
        let param ='$this'
          , result = processor.process(param, scopedVar);
        expect(result).to.be.equal(JSON.stringify(scopedVar));
    });

    it("should replace 'this' scoped string variable (scope is object)", function(){
        let scopedVar = { key: 'dummyString' }
          , param ='$this.key'
          , result = processor.process(param, scopedVar);
        expect(result).to.be.equal(JSON.stringify(scopedVar.key));
    });

});