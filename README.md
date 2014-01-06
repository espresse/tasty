tasty
=====

Simple mock/stub library


Example usage
=============

```
var Publication = (function() {

function Publication() {}

  Publication.prototype.setName = function(name) {
    this.name = name;
    return this;
  };

  return Publication;

})();

console.log(new Publication().setName('x').name);

var pub = Publication;
var mock = new testy.Tasty(pub);

mock.method('setName').
      fake(function(n){this.name = "_" + n;return this;}).
      spy();

mock.method('getName').
      fake(function(){return this.name;}).
      spy();

mock.start()

mock.method('another').check.hasBeenCalled()

console.log(new Publication().setName('dupa'))
console.log(new Publication())
console.log(new Publication().setName.toString())

mock.restore()

console.log(new Publication().setName('dupa2'))
console.log(new Publication().setName.toString())
```