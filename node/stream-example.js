import sax from 'sax';
import fs from 'node:fs';

const strict = true;
var saxStream = sax.createStream(strict, {})
saxStream.on("error", function (e) {
    // unhandled errors will throw, since this is a proper node
    // event emitter.
    console.error("error!", e)
    // clear the error
    this._parser.error = null
    this._parser.resume()
})
saxStream.on("opentag", function (node) {
    console.log("opentag", node);
    node.attributes.extra = "etc";
})
// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
fs.createReadStream("example.xml")
    .pipe(saxStream)
    .pipe(fs.createWriteStream("output/stream_output.xml"))