Node PuppetDB query
===================

A JavaScript version of the [puppetdbquery module for puppet](https://github.com/dalen/puppet-puppetdbquery).

It is written using [JISON](http://zaach.github.io/jison/).

The find-nodes utility is included as an example on how to use it.
Until [PDB-561](https://tickets.puppetlabs.com/browse/PDB-561) is fixed you need to
set the variable `puppetdbquery.yy.nodeQuery` to true to parse for the nodes endpoint.
It should be false for the resources, facts and events endpoints. An example of doing this
is in the find-nodes script.

License
-------

This is licensed under the Apache V2 license.
