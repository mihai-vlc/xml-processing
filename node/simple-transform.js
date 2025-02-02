import { XMLParser, XMLBuilder } from "fast-xml-parser";
import fs from 'node:fs';

let parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "attrs",
    updateTag: function (tagName, jPath, attrs) {
        if (tagName == 'country') {
            attrs.attrs['extra-attr'] = attrs.attrs.name;
        }
        console.log(arguments);
        return tagName;
    }
});
let fileContent = fs.readFileSync('example.xml', { encoding: 'utf8' });
let fileData = parser.parse(fileContent);


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
