#!/usr/bin/env coffee

getCommandlineOptions = ->
  os = require('os')
  opts = require('nomnom').script('find-nodes')
    .option 'host',
      abbr: 'H'
      default: 'puppetdb'
      metavar: 'HOST'
      help: 'PuppetDB host'
    .option 'port',
      abbr: 'p'
      default: 8080
      metavar: 'PORT'
      help: 'PuppetDB port'
      callback: (port) ->
        parseInt(port)
    .option 'ssl',
      abbr: 's'
      flag: true
      default: false
      help: 'Use SSL'
    .option 'key',
      default: '/etc/puppet/ssl/private_keys/' + os.hostname() + '.pem'
      metavar: 'KEY'
      help: 'Private SSL key file'
    .option 'cert',
      default: '/etc/puppet/ssl/certs/' + os.hostname() + '.pem'
      metavar: 'CERT'
      help: 'SSL certificate file'
    .option 'ca',
      default: '/etc/puppet/ssl/ca.pem'
      metavar: 'CACERT'
      help: 'SSL CA certificate file'
    .option 'version',
      abbr: 'v'
      flag: true
      help: 'print version and exit'
      callback: ->
        require('../package.json').version
    .option 'print',
      abbr: 'P'
      flag: true
      default: false
      help: 'Print parsed query and exit'
    .option 'query',
      flag: true
      required: true
      position: 0
      help: 'query string'
    .parse()
  opts

opts = getCommandlineOptions()
puppetdbquery = require('../build/puppetdbquery')
try
  parser = puppetdbquery.parser
  query = JSON.stringify(parser.parse(opts.query))
catch err
  console.log err

# If print option is specified, just print parsed query
# otherwise fire off a query to puppetdb
if opts.print
  console.log query
else
  querystring = require('querystring')
  options =
    host: opts.host
    port: opts.port
    path: '/v4/nodes?' + querystring.stringify(query: query)
    headers:
      Accept: 'application/json'

  if opts.ssl
    http = require('https')
    fs = require('fs')
    options.key = fs.readFileSync(opts.key)
    options.cert = fs.readFileSync(opts.cert)
    options.ca = fs.readFileSync(opts.ca)
  else
    http = require('http')

  # We have the full response, parse it and print the node names
  http.get options, (res) ->
    data = ''
    res.on 'data', (chunk) ->
      data += chunk

    res.on 'end', () ->
      JSON.parse(data).forEach (node) ->
        console.log node.certname

  .on 'error', (e) ->
    console.log "Error fetching from #{opts.host} : #{opts.port} #{e}"
