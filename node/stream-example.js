import { createWriteStream, createReadStream } from "fs";
import sax from "sax";
import { createCB } from "xmlbuilder2";

const { createStream } = sax;

// Create a SAX parser
const strict = true;
const parser = createStream(strict, {});

// Create a writable stream for the output XML
const outputStream = createWriteStream("output/stream_output.xml", {
  encoding: "utf8",
});

// Initialize the XML builder with a callback
const xmlStream = createCB({
  data: (chunk) => {
    outputStream.write(chunk);
  },
  end: () => outputStream.end(),
  spaceBeforeSlash: true,
});

xmlStream.dec({
  version: "1.0",
  encoding: "UTF-8",
});

outputStream.write("\n");
let hasRoot = false;

// Handle SAX events
parser.on("opentag", (node) => {
  hasRoot = true;
  xmlStream.ele(node.name, node.attributes);
});

parser.on("text", (text) => {
  if (hasRoot) {
    // any text or whitespace needs to be inside the root element
    xmlStream.txt(text);
  }
});

parser.on("closetag", (name) => {
  if (name == 'country') {
    xmlStream.txt("    ")
    xmlStream.ele('extra', {
        "name": "population"
    });
    xmlStream.txt("main text content")
    xmlStream.up()
    xmlStream.txt("\n    ")
  }
  xmlStream.up();
});

parser.on("comment", (comment) => {
  xmlStream.com(comment);
});

parser.on("cdata", (cdata) => {
  xmlStream.dat(cdata);
});

parser.on("error", (error) => {
  console.error("Error:", error);
  //   parser.resume();
});

parser.on("end", () => {
  console.log("Parsing completed, output placed in output/stream_output.xml");
});

// Read the large XML file
createReadStream("example.xml").pipe(parser);
