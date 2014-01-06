(function(exports){

   var TastyFaker = (function() {

    var TastyFakerAssert = (function() {
      function TastyFakerAssert(faker) {
        this.faker = faker;
      }

      TastyFakerAssert.prototype.hasBeenCalled = function() {
        return this.faker.params.callCounter > 0;
      };

      TastyFakerAssert.prototype.calledExactly = function(n) {
        return this.faker.params.callCounter === n;
      };

      return TastyFakerAssert;
    })();

    function TastyFaker(obj) {
      this.params = {
        callCounter: 0,
        atMostLimit: null,
        methodName: null,
        prototyped: false
      };

      this.methods = {
        original: undefined,
        faker: undefined
      };

      this.obj = obj;
      this.check = new TastyFakerAssert(this);

    }

    TastyFaker.prototype.method = function(name) {
      this.params.methodName = name;
      var _method = undefined;

      if(!!this.obj.prototype && !!this.obj.prototype[name]) {
        this.params.prototyped = true;
        _method = this.obj.prototype[name];
      }
      else {
        _method = this.obj[name];
      }

      if(!this.methods.original) this.methods.original = _method;
      if(!this.methods.faker) this.methods.faker = _method;

      return this;
    };

    TastyFaker.prototype.fake = function(newMethod) {
      this.methods.faker = newMethod;
      return this;
    };

    TastyFaker.prototype.spy = function() {
      this.params.atMostLimit = undefined;
      return this;
    };

    TastyFaker.prototype.maxCalls = function(n) {
      if(this.params.atMostLimit !== undefined) that.params.atMostLimit = n;
      return this;
    };

    TastyFaker.prototype.restore = function() {
      if(this.params.prototyped)
        if(this.methods.original)
          this.obj.prototype[this.params.methodName] = this.methods.original;
        else
          delete this.obj.prototype[this.params.methodName]
      else
        if(this.methods.original)
          this.obj[this.params.methodName] = this.methods.original;
        else
          delete this.obj[this.params.methodName]

      return this;
    };

    TastyFaker.prototype.process = function() {
      var that = this;

      if(this.params.prototyped)
        _setTo = this.obj.prototype;
      else _setTo = this.obj;

      _setTo[this.params.methodName] = function() {
        ++that.params.callCounter;
        if(that.params.atMostLimit !== null && that.params.atMostLimit !== undefined && that.params.atMostLimit < that.params.callCounter) {
          throw new Error("" + name + " has been more than its limit of " + that.params.atMostLimit);
        }
        return that.methods.faker.apply(this, arguments);
      };
      return this;
    };

    TastyFaker.prototype.calls = function() {
      return this.callCounter;
    };

    return TastyFaker;
  })();


  var Tasty = (function() {

    function Tasty(obj) {
      this.obj = obj;
      this.originals = {};
    }

    Tasty.prototype.method = function(name) {
      if(this.originals[name]) return this.originals[name];
      else return (this.originals[name] = new TastyFaker(this.obj).method(name));
    };

    Tasty.prototype.start = function() {
      for(var key in this.originals) {
        if(this.originals.hasOwnProperty(key)) {
          this.originals[key].process();
        }
      }
      return this;
    };

    Tasty.prototype.restore = function(name) {
      for(var key in this.originals) {
        if(this.originals.hasOwnProperty(key)) {
          this.originals[key].restore();
        }
      }
      return this;
    };


    return Tasty;
   })();

   exports.Tasty = Tasty;
   exports.TastyFaker = TastyFaker;

})(typeof exports === 'undefined'? this['testy']={}: exports);
 
