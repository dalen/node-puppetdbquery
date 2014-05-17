var puppetdbquery = require('../lib/puppetdbquery');

exports['empty queries'] = function(test) {
  test.equal(puppetdbquery.parse(''), null);
  test.done();
};

exports['double quoted strings'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo="bar"'), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [ "select-facts",
              [ "and", [ "=", "name", "foo" ], [ "=", "value", "bar" ] ] ] ] ]);
  test.done();
};

exports['double quoted strings'] = function(test) {
  test.deepEqual(puppetdbquery.parse('foo=\'bar\''), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [ "select-facts",
              [ "and", [ "=", "name", "foo" ], [ "=", "value", "bar" ] ] ] ] ]);
  test.done();
};

exports['precedence'] = function(test) {
  test
      .deepEqual(
          puppetdbquery.parse('foo=1 or bar=2 and baz=3'),
          [
              "or",
              [
                  "in",
                  "certname",
                  [
                      "extract",
                      "certname",
                      [
                          "select-facts",
                          [ "and", [ "=", "name", "foo" ], [ "=", "value", 1 ] ] ] ] ],
              [
                  "and",
                  [
                      "in",
                      "certname",
                      [
                          "extract",
                          "certname",
                          [
                              "select-facts",
                              [ "and", [ "=", "name", "bar" ],
                                  [ "=", "value", 2 ] ] ] ] ],
                  [
                      "in",
                      "certname",
                      [
                          "extract",
                          "certname",
                          [
                              "select-facts",
                              [ "and", [ "=", "name", "baz" ],
                                  [ "=", "value", 3 ] ] ] ] ] ] ]);
  test
      .deepEqual(
          puppetdbquery.parse('(foo=1 or bar=2) and baz=3'),
          [
              "and",
              [
                  "or",
                  [
                      "in",
                      "certname",
                      [
                          "extract",
                          "certname",
                          [
                              "select-facts",
                              [ "and", [ "=", "name", "foo" ],
                                  [ "=", "value", 1 ] ] ] ] ],
                  [
                      "in",
                      "certname",
                      [
                          "extract",
                          "certname",
                          [
                              "select-facts",
                              [ "and", [ "=", "name", "bar" ],
                                  [ "=", "value", 2 ] ] ] ] ] ],
              [
                  "in",
                  "certname",
                  [
                      "extract",
                      "certname",
                      [
                          "select-facts",
                          [ "and", [ "=", "name", "baz" ], [ "=", "value", 3 ] ] ] ] ] ]);
  test.done();
};

exports['resource queries with type and title'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[foo]'), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [
              "select-resources",
              [ "and", [ "=", "type", "File" ], [ "=", "title", "foo" ],
                  [ "=", "exported", false ] ] ] ] ]);
  test.done();
};

exports['resource queries with type, title and parameters'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[foo]{bar=baz}'), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [
              "select-resources",
              [ "and", [ "=", "type", "File" ], [ "=", "title", "foo" ],
                  [ "=", "exported", false ],
                  [ "=", [ "parameter", "bar" ], "baz" ] ] ] ] ]);
  test.done();
};

exports['precedence within resource parameter queries'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[foo]{foo=1 or bar=2 and baz=3}'), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [
              "select-resources",
              [
                  "and",
                  [ "=", "type", "File" ],["=", "title", "foo"],
                  [ "=", "exported", false ],
                  [
                      "or",
                      [ "=", [ "parameter", "foo" ], 1 ],
                      [ "and", [ "=", [ "parameter", "bar" ], 2 ],
                          [ "=", [ "parameter", "baz" ], 3 ] ] ] ] ] ] ]);
  test.deepEqual(puppetdbquery.parse('file[foo]{(foo=1 or bar=2) and baz=3}'),
      [
          "in",
          "certname",
          [
              "extract",
              "certname",
              [
                  "select-resources",
                  [
                      "and",
                      [ "=", "type", "File" ],["=", "title", "foo"],
                      [ "=", "exported", false ],
                      ["and", [ "or", [ "=", [ "parameter", "foo" ], 1 ],
                          [ "=", [ "parameter", "bar" ], 2 ] ],
                      [ "=", [ "parameter", "baz" ], 3 ] ] ] ] ] ]);
  test.done();
};

exports['capitalize class names'] = function(test) {
  test.deepEqual(puppetdbquery.parse('class[foo::bar]'), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [
              "select-resources",
              [ "and", [ "=", "type", "Class" ], [ "=", "title", "Foo::Bar" ],
                  [ "=", "exported", false ] ] ] ] ]);
  test.done();
};

exports['resource queries with regeexp title matching'] = function(test) {
  test.deepEqual(puppetdbquery.parse('file[~foo]'), [
      "in",
      "certname",
      [
          "extract",
          "certname",
          [
              "select-resources",
              [ "and", [ "=", "type", "File" ],["~", "title", "foo"],
                  [ "=", "exported", false ] ] ] ] ]);
  test.done();
};

exports['not expressions'] = function(test) {
  test
      .deepEqual(puppetdbquery.parse('not foo=bar'),
          [
              "not",
              [
                  "in",
                  "certname",
                  [
                      "extract",
                      "certname",
                      [
                          "select-facts",
                          [ "and", [ "=", "name", "foo" ],
                              [ "=", "value", "bar" ] ] ] ] ] ]);
  test.done();
};
