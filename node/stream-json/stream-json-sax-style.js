import clarinet from 'clarinet';
import fs from 'node:fs';

const stream = clarinet.createStream();

stream.on('openarray', function () {
    console.log("openarray", arguments);
    console.log(`Found array on line ${this._parser.line}`);
});
stream.on('closearray', function () {
    console.log("closearray", arguments);
});

stream.on('openobject', function (firstKey) {
    console.log("openobject, firstKey =", firstKey);
});

stream.on('key', function (key) {
    console.log("key", key);
});

stream.on('value', function (key) {
    console.log("value", key);
});

stream.on('closeobject', function () {
    console.log("closeobject", arguments);
});

stream.on('error', function (e) {
    console.log("error", e);
});

stream.on('end', function () {
    console.log("end", arguments);
});

fs.createReadStream('example.json').pipe(stream);

