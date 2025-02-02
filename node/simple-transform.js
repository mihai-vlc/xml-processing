import { XMLParser, XMLBuilder } from "fast-xml-parser";
import fs from 'node:fs';

let parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "attrs",
    tagValueProcessor: function (name, val, jPath, hasAttr, isLeaf) {
        console.log("tagValueProcessor", arguments);

        if (name == 'year') {
            return parseInt(val).toLocaleString();
        }
        return val;
    },
    updateTag: function (tagName, jPath, attrs) {
        if (tagName == 'country') {
            attrs.attrs['extra-attr'] = attrs.attrs.name;
        }
        if (tagName == 'gdppc') {
            return false; // skip tag
        }
        console.log("updateTag", arguments);
        return tagName;
    }
});
let fileContent = fs.readFileSync('example.xml', { encoding: 'utf8' });
let fileData = parser.parse(fileContent);

console.log("fileData", fileData);

for (let country of fileData.data.country) {
    if (country.attrs.name == 'Singapore') {
        country.extra = {
            attrs: {
                population: 9000
            },
            "#text": "main content"
        }
    }
}

let builder = new XMLBuilder({
    attributeNamePrefix: "",
    attributesGroupName: "attrs",
    format: true
});
let output = builder.build(fileData);

fs.writeFileSync("output/simple_transform_output.xml", output, { encoding: 'utf8' });
console.log("Writing output/simple_transform_output.xml");
