package main

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
)

type SAXHandler struct {
	outputFile *os.File
	encoder    *xml.Encoder
}

func NewSAXHandler(outputFilename string) (*SAXHandler, error) {
	file, err := os.Create(outputFilename)
	if err != nil {
		return nil, fmt.Errorf("error creating output file: %w", err)
	}

	encoder := xml.NewEncoder(file)
	// encoder.Indent("", "  ")

	return &SAXHandler{
		outputFile: file,
		encoder:    encoder,
	}, nil
}

func (h *SAXHandler) StartElement(name xml.Name, attrs []xml.Attr) {
	if name.Local == "country" {
		extraAttr := xml.Attr{Name: xml.Name{Local: "extra-attr"}, Value: "new value"}
		attrs = append(attrs, extraAttr)
	}

	h.encoder.EncodeToken(xml.StartElement{Name: name, Attr: attrs})
}

func (h *SAXHandler) EndElement(name xml.Name) {
	if name.Local == "country" {
		// adds the following element
		// <extra name="population">main text content</extra>
		extraElement := xml.StartElement{
			Name: xml.Name{Local: "extra"},
			Attr: []xml.Attr{
				{Name: xml.Name{Local: "name"}, Value: "population"},
			},
		}
		h.encoder.EncodeToken(xml.CharData("    "))
		h.encoder.EncodeToken(extraElement)
		h.encoder.EncodeToken(xml.CharData("main text content"))
		h.encoder.EncodeToken(extraElement.End())
		h.encoder.EncodeToken(xml.CharData("\n    "))
	}

	h.encoder.EncodeToken(xml.EndElement{Name: name})
}

func (h *SAXHandler) CharData(data []byte) {
	h.encoder.EncodeToken(xml.CharData(data))
}

func (h *SAXHandler) Comment(comment []byte) {
	h.encoder.EncodeToken(xml.Comment(comment))
}

func (h *SAXHandler) ProcInst(target string, inst []byte) {
	h.encoder.EncodeToken(xml.ProcInst{Target: target, Inst: inst})
}

func (h *SAXHandler) Directive(dir []byte) {
	h.encoder.EncodeToken(xml.Directive(dir))
}

func (h *SAXHandler) Close() error {
	h.encoder.Flush()
	return h.outputFile.Close()
}

func ParseXMLWithSAX(filename string, handler *SAXHandler) error {
	file, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("error opening file: %w", err)
	}
	defer file.Close()

	decoder := xml.NewDecoder(file)
	decoder.DefaultSpace = ""

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
			handler.StartElement(xml.Name{Local: t.Name.Local}, t.Attr)
		case xml.EndElement:
			handler.EndElement(xml.Name{Local: t.Name.Local})
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
	handler, err := NewSAXHandler("output/stream_output.xml")
	if err != nil {
		fmt.Printf("Error creating SAX handler: %v\n", err)
		return
	}
	defer handler.Close()

	err = ParseXMLWithSAX("example.xml", handler)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	}
}
