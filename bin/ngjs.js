#! /usr/bin/env node --harmony
var program = require('commander');

program
 .version('0.1.0')
 .command('new [name]', 'create new app').alias('n')
 .command('gen', 'list packages installed', {isDefault: true})
 .parse(process.argv);
      