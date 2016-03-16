'use strict';

var chai = require('chai')
  , spies = require('chai-spies')
  , Adder = require('../sources/Adder.js');

chai.use(spies);

var expect = chai.expect;

describe('Adder', function(){

    let objectName = 'objectName';

    let fileWriter;

    beforeEach(function(){
        fileWriter = chai.spy();
    });

    it("shall throw error when no object name given", function(){
        let actionGenerator = chai.spy();
        let sut = new Adder(fileWriter, actionGenerator);

        function fn(){ sut.add(); }
        expect(fn).to.throw(/objectName/);
    });

    it("shall throw error when ActionGenerator throws one", function(){
        let actionGenerator = chai.spy(function(){ throw new Error('dummyMessage'); });
        let sut = new Adder(fileWriter, actionGenerator);

        function fn(){ sut.add(objectName); }
        expect(fn).to.throw(/dummyMessage/);
    });

    it("shall write all files returned by ActionGenerator", function(){
        let actions = [{data: 'data1', target: 'target1'}, {data: 'data2', target: 'target2'}];
        let actionGenerator = chai.spy(function(){ return actions; });
        let sut = new Adder(fileWriter, actionGenerator);

        sut.add(objectName);
        expect(actionGenerator).to.be.called.with(objectName);
        expect(fileWriter).to.be.called.with(actions[0].target, actions[0].data);
        expect(fileWriter).to.be.called.with(actions[1].target, actions[1].data);
    });

});