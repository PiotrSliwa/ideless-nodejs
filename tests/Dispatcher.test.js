'use strict';

var chai = require('chai')
  , spies = require('chai-spies')
  , Dispatcher = require('../sources/Dispatcher.js');

chai.use(spies);

var expect = chai.expect;

describe('Dispatcher.dispatch', function(){

    it("shall throw error when no command given", function(){
        let argv = {_: []}
        function fn() { Dispatcher.dispatch(argv); }
        expect(fn).to.throw();
    });

    it("shall throw error when no job assigned to given command", function(){
        let dummy = {run: function() { } }
        let argv = {_: ['otherCommand']}
        function fn() { Dispatcher.dispatch(argv, {dummy: dummy}); }
        expect(fn).to.throw();
    });

    it("shall run job assigned to the command", function(){
        let job = {run: chai.spy()}
        let argv = {_: ['x', 'y']}
        Dispatcher.dispatch(argv, {x: job});
        expect(job.run).to.be.called();
    });

});