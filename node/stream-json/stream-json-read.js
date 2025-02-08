import fs from "node:fs";
import JSONStream from "JSONStream";

const parser = JSONStream.parse("$*");

parser.on("data", function () {
  console.log("data", arguments);
});

parser.on("end", function () {
  console.log("end", arguments);
});

parser.on("error", function () {
  console.log("error", arguments);
});

fs.createReadStream('example.json').pipe(parser);



const parser2 = JSONStream.parse("scripts.$*"); // using JSONPath

parser2.on("data", function () {
  console.log("scripts data", arguments);
});

parser2.on("end", function () {
  console.log("scripts end", arguments);
});

parser2.on("error", function () {
  console.log("error", arguments);
});


fs.createReadStream('example.json').pipe(parser2);
