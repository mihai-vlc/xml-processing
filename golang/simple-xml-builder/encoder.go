package main

import (
	"encoding/xml"
	"os"
)

func main() {
	encoder := xml.NewEncoder(os.Stdout)
	encoder.Indent("", "  ")

	// Define the root element with xmlns
	root := xml.StartElement{
		Name: xml.Name{Local: "root"},
		Attr: []xml.Attr{
			{Name: xml.Name{Local: "xmlns"}, Value: "http://example.com/ns"}, // Namespace on root
		},
	}

	child := xml.StartElement{Name: xml.Name{Local: "child"}}

	// Write XML manually
	encoder.EncodeToken(root)  // <root xmlns="http://example.com/ns">
	encoder.EncodeToken(child) // <child>
	encoder.EncodeToken(xml.CharData("Hello, World!"))
	encoder.EncodeToken(child.End()) // </child>
	encoder.EncodeToken(root.End())  // </root>

	// Flush to apply indentation
	encoder.Flush()
}
