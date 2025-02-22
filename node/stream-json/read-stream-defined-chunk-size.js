import { createReadStream } from "node:fs";
import { Readable, Stream } from "node:stream";

// const readable = Readable.from(["a", "b", "c"]);
const readable = createReadStream('example.json', {
  encoding: 'utf-8',
  highWaterMark: 1 // control chunk size
});

readable.on("data", (chunk) => {
  console.log("data", chunk);
});

readable.on("end", (chunk) => {
  console.log('end', chunk);
});
