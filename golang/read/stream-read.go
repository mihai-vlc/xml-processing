package main

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
)

type SAXHandler struct{}

func (h *SAXHandler) StartElement(name xml.Name, attrs []xml.Attr) {
	fmt.Printf("Start Element: %s\n", name.Local)
	for _, attr := range attrs {
		fmt.Printf("  Attribute: %s = %s\n", attr.Name.Local, attr.Value)
	}
}

func (h *SAXHandler) EndElement(name xml.Name) {
	fmt.Printf("End Element: %s\n", name.Local)
}

func (h *SAXHandler) CharData(data []byte) {
	fmt.Printf("Character Data: %s\n", string(data))
}

func (h *SAXHandler) Comment(comment []byte) {
	fmt.Printf("Comment: %s\n", string(comment))
}

func (h *SAXHandler) ProcInst(target string, inst []byte) {
	fmt.Printf("Processing Instruction: %s %s\n", target, string(inst))
}

func (h *SAXHandler) Directive(dir []byte) {
	fmt.Printf("Directive: %s\n", string(dir))
}

func ParseXMLWithSAX(filename string, handler *SAXHandler) error {
	file, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("error opening file: %w", err)
	}
	defer file.Close()

	decoder := xml.NewDecoder(file)

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return fmt.Errorf("error decoding token: %w", err)
		}

		switch t := token.(type) {
		case xml.StartElement:
			handler.StartElement(t.Name, t.Attr)
		case xml.EndElement:
			handler.EndElement(t.Name)
		case xml.CharData:
			handler.CharData(t)
		case xml.Comment:
			handler.Comment(t)
		case xml.ProcInst:
			handler.ProcInst(t.Target, t.Inst)
		case xml.Directive:
			handler.Directive(t)
		}
	}

	return nil
}

func main() {
	handler := &SAXHandler{}
	err := ParseXMLWithSAX("example.xml", handler)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}
}
