const jsf = require('json-schema-faker');
const fs = require('fs');
const schema = require('./schema');

jsf.extend('faker', () => require('faker'));

jsf.option('useDefaultValue', true);

// use the async-version (preferred way)
jsf.resolve(schema).then(data => {
  fs.writeFileSync('data.json', JSON.stringify(data));
});

// sync-version (blocking)
jsf.generate(schema); // [object Object]
