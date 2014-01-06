var assert = require('assert');
var tasty = require('../src/tasty');

describe("TastyFaker", function() {
  before(function(done) {
    Publication = (function() {
      function Publication() {};

      Publication.prototype.setName = function(name) {
        this.name = name;
        return this;
      };
      return Publication;

    })();
    publication = new Publication();
    done();
  })

  beforeEach(function(done) {
    test = new tasty.TastyFaker(publication);
    done();
  });

  afterEach(function(done) {
    test.restore();
    done();
  });


  it("should initialize", function() {
    test.method('some').fake(function() {return "test";})
    test.process();

    assert.equal(publication.some(), "test");
  });

  context('Original', function() {
    it("should be undefined when adding to nonexisting method", function() {
      test.method('aa');
      assert.equal(test.methods.original, undefined)
    });

    it("should be undefined when adding to nonexisting method", function() {
      test.method('setName');
      assert.equal(typeof test.methods.original, "function")
    });
  });

  context('Fake', function() {
    it("should be undefined", function() {
      test.method('aa');
      assert.equal(test.methods.original, undefined)
    });

    it("should be undefined when adding to nonexisting method", function() {
      test.method('setName');
      assert.equal(typeof test.methods.original, "function")
    });

  });
});

