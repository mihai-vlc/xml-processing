import { create } from "xmlbuilder2";
import { useNamespaces } from "xpath";
import { readFileSync } from "fs";

const doc = create(readFileSync("example.xml", { encoding: "utf-8" }));

const select = useNamespaces({
  x: "https://my-namespace.com",
});

console.log("=====");
console.log("all elements with name='Singapore'");
console.log("=====");
for (let node of select("//*[@name='Singapore']", doc.node)) {
  console.log(node.localName);
}

console.log("=====");
console.log("all year element contents");
console.log("=====");
for (let node of select("//x:year/text()", doc.node)) {
  console.log(node.nodeValue);
}

console.log("=====");
console.log("the value of `name` attribute for all `country` elements");
console.log("=====");
for (let node of select("//x:country/@name", doc.node)) {
  console.log(node.nodeValue);
}
