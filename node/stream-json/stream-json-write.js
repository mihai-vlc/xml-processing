import fs from "node:fs";
import JSONStream from "JSONStream";

const ARRAY_OUTPUT_FILE_PATH = "output/array-stringify.json";
// stringify an array
const jsonArrayStream = JSONStream.stringify("[\n", ",\n", "\n]\n");

jsonArrayStream.pipe(fs.createWriteStream(ARRAY_OUTPUT_FILE_PATH));

for (let i = 0; i < 10; i++) {
  jsonArrayStream.write({
    id: i,
    name: "John " + i,
    value: i * 100,
  });
}

jsonArrayStream.end();
console.log(`Completed processing ${ARRAY_OUTPUT_FILE_PATH}`);

const OBJECT_OUTPUT_FILE_PATH = "output/object-stringify.json";

const jsonObjectStream = JSONStream.stringifyObject("{\n", ",\n", "\n}\n");

jsonObjectStream.pipe(fs.createWriteStream(OBJECT_OUTPUT_FILE_PATH));


for (let i = 0; i < 10; i++) {
  jsonObjectStream.write([
    `info-${i}`,    // key
    {          // value
      id: i,
      name: "John " + i,
      value: i * 100,
    },
  ]);
}
jsonObjectStream.end();


