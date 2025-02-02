import { XMLParser } from "fast-xml-parser";
import fs from 'node:fs';

let parser = new XMLParser({
    ignoreAttributes: false
});
let fileContent = fs.readFileSync('example.xml', { encoding: 'utf8' });
let fileData = parser.parse(fileContent);

console.log(fileData.data.country);
