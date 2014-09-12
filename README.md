Node PuppetDB query
===================

A JavaScript version of the [puppetdbquery module for puppet](https://github.com/dalen/puppet-puppetdbquery).

It is written using [JISON](http://zaach.github.io/jison/) and [ast-types](http://github.com/benjamn/ast-types).

```js
var puppetdbquery = require('puppetdbquery');
puppetdbquery.parse('(puppetversion="3.6.2" or puppetversion="3.7.0") and kernel=Linux');
// ["and",
//   ["or",
//     ["in","certname",
//       ["extract","certname",
//         ["select-fact-contents",
//           ["and", ["=","path", ["puppetversion"]],["=","value","3.6.2"]]]]],
//     ["in","certname",
//       ["extract","certname",
//         ["select-fact-contents",
//           ["and", ["=","path",["puppetversion"]],["=","value","3.7.0"]]]]]],
//   ["in","certname",
//     ["extract","certname",
//       ["select-fact-contents",
//         ["and",["=","path",["kernel"]],["=","value","Linux"]]]]]]
```

The find-nodes utility is included as an example on how to use it.

Syntax
------

Use `fact=value` to search for nodes where `fact` equals `value`. To search for
structured facts use dots between each part of the fact path, for example
`foo.bar=baz`.

Resources can be matched using the syntax `type[title]{param=value}`.
The part in brackets is optional. You can also specify `~` before the `title`
to do a regexp match on the title. Type names and class names are case insensitive.
A resource can be preceded by @@ to match exported resources, the default is to only
match "local" resources.

Strings can contain letters, numbers or the characters :-_ without needing to be quoted.
If they contain any other characters they need to be quoted with single or double quotes.
Use backslash (\) to escape quotes within a quoted string or double backslash for backslashes.

An unquoted number or the strings true/false will be interpreted as numbers and boolean
values, use quotation marks around them to search for them as strings instead.

A @ sign before a string causes it to be interpreted as a date parsed with
[timespec](https://github.com/calebcase/timespec). For example `@"2 hours ago"`.

A # sign can be used to do a subquery, against the nodes endpoint for example to
query the `report-timestamp`, `catalog-timestamp` or `facts-timestamp` fields.
For example `#node.report-timestamp < @"2 hours ago"`.

A subquery using the # sign can have a block of expressions instead of a single
expression. For example `#node { report-timestamp > @"4 hours ago" and
report-timestamp < @"2 hours ago" }`

A bare string without comparison operator will be treated as a regexp match against the certname.

#### Comparison operators

| Op | Meaning                |
|----|------------------------|
| =  | Equality               |
| != | Not equal              |
| ~  | Regexp match           |
| !~ | Not equal Regexp match |
| <  | Less than              |
| =< | Less than or equal     |
| >  | Greater than           |
| => | Greater than or equal  |

#### Logical operators

| Op  |            |
|-----|------------|
| not | (unary op) |
| and |            |
| or  |            |

Shown in precedence order from highest to lowest. Use parenthesis to change order in an expression.

### Query Examples

Nodes with package mysql-server and amd64 arcitecture

    (package["mysql-server"] and architecture=amd64)

Nodes with the class Postgresql::Server and a version set to 9.3

    class[postgresql::server]{version=9.3}

Nodes with 4 or 8 processors running Linux

    (processorcount=4 or processorcount=8) and kernel=Linux

Nodes that haven't reported in the last 2 hours

    #node.report-timestamp<@"now - 2 hours"

License
-------

This is licensed under the Apache V2 license.
