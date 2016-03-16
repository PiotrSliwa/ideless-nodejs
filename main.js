#!/usr/bin/env node

'use strict';

var Dispatcher = require('./sources/Dispatcher.js')
  , AdderRunner = require('./sources/AdderRunner.js')
  , FileWriter = require('./sources/FileWriter.js')
  , ConfigParser = require('./sources/ConfigParser.js')
  , FileReaderInDirectory = require('./sources/FileReaderInDirectory.js');

var argv = require('optimist')
    .usage('Usage: [command] [arguments] [options] \n Commands: add')
    .demand(2)
    .demand('d')
    .alias('ideless-dir')
    .describe('d', 'Path to ideless directory (containing config file)')
    .default('d', '.ideless')
    .demand('c')
    .alias('config-file')
    .describe('c', 'Path to config file in ideless directory')
    .default('c', 'config.json')
    .argv;

var idelessDirectory = argv.d
  , idelessFile = argv.c;

var configParser = new ConfigParser(new FileReaderInDirectory(idelessDirectory))
  , config = configParser.parse(idelessFile);

var fileUpdater = new FileWriter().updateFile;

var jobs = {
    add: new AdderRunner(fileUpdater, config)
};

try {
    Dispatcher.dispatch(argv, jobs);
}
catch(err) {
    console.log(err);
}
