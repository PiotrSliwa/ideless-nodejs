'use strict';

var chai = require('chai')
  , spies = require('chai-spies')
  , AddActionsGenerator = require('../sources/AddActionsGenerator.js');

chai.use(spies);

var expect = chai.expect;

describe('AddActionsGenerator', function(){

    let OBJECT_NAME = 'OBJECT_NAME';

    it("shall throw error during construction when no valid config given", function(){
        function fn() { new AddActionsGenerator(); }
        expect(fn).to.throw(/valid/i);
    });

    it("shall throw error when non-existant object name given", function(){
        let sut = new AddActionsGenerator({objects: {}});
        function fn() { sut('dummy'); }
        expect(fn).to.throw(/does not contain/i);
    });

    it("shall return all files returned by config repository for given object name", function(){
        let filesArr = [{x:'x'}];
        let config = {
            objects: {
                'OBJECT_NAME': {
                    files: filesArr
                }
            }
        }
        let sut = new AddActionsGenerator(config);
        let result = sut(OBJECT_NAME);
        expect(result).to.deep.equal(filesArr);
    });

});