Node PuppetDB query
===================

A JavaScript version of the [puppetdbquery module for puppet](https://github.com/dalen/puppet-puppetdbquery).

It is written using [JISON](http://zaach.github.io/jison/).

The find-nodes utility is included as an example on how to use it.
Until [PDB-561](https://tickets.puppetlabs.com/browse/PDB-561) is fixed you need to
set the variable `puppetdbquery.yy.nodeQuery` to true to parse for the nodes endpoint.
It should be false for the resources, facts and events endpoints. An example of doing this
is in the find-nodes script.

Syntax
------

Use `fact=value` to search for nodes where `fact` equals `value`.

Resources can be matched using the syntax `type[title]{param=value}`.
The part in brackets is optional. You can also specify `~` before the `title`
to do a regexp match on the title. Type names and class names are case insensitive.
A resource can be preceded by @@ to match exported resources, the default is to only
match "local" resources.

Strings can contain letters, numbers or the characters .:-_ without needing to be quoted.
If they contain any other characters they need to be quoted with single or double quotes.
Use backslash (\) to escape quotes within a quoted string or double backslash for backslashes.

An unquoted number or the strings true/false will be interpreted as numbers and boolean
values, use quotation marks around them to search for them as strings instead.

A bare string without comparison operator will be treated as a regexp match against the certname.

If the left side of a comparison starts with a dot it will search on the object
itself instead of a fact/parameter of it. For example the query
`.catalog_timestamp>"2011-01-01T12:01:00-03:00"` will search for nodes with a
catalog newer than that. This can also be used in resource parameter lists
`file[foo]{ .line=20 }` will search for nodes that have a file[foo] resource
defined on line number 20.

#### Comparison operators

| Op | Meaning               |
|----|-----------------------|
| =  | Equality              |
| != | Not equal             |
| ~  | Regexp match          |
| <  | Less than             |
| =< | Less than or equal    |
| >  | Greater than          |
| => | Greater than or equal |

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

License
-------

This is licensed under the Apache V2 license.
