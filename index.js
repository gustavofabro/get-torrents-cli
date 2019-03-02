#!/usr/bin/env node

'use-strict'

var program = require('commander');
var pkg = require('./package.json');

let getTorrents = (data, options) => {
    console.log(data);
};

program
    .command('get <data>')
    .action(getTorrents)
    .version(pkg.version)

program.parse(process.argv)