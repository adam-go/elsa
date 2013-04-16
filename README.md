Elsa
====

Elsa is an elasticsearch client for node.js. It is still very incomplete
but has enough functionality to index, remove, and search for documents.

```js
var elsa = require('elsa');

elsa.config({
  url: 'localhost',
  port: 9200, // this is the default
  index: 'index_name'
});

var documents = [
  {name: 'Snoop Dogg', origin: 'Long Beach, CA'},
  {name: '50 Cent', origin: 'Queens, NY'}
];

// You can also pass a single document to index.
// Documents currently are always bulk-indexed.

elsa.index('rappers', documents, function (err, res, body) {
  // This callback is passed to request.
});

elsa.search('rappers', {match: {name: 'Nas'}}, function (err, result) {
  // result is the elasticsearch response converted to json.
});

var objId = 'idToRemove';

elsa.remove('rappers', objId, function (err, res body) {
  // This callback is also passed to request.
  // You can omit the 2nd arg to remove the entire type.
});
```
