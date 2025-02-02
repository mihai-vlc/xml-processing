from xml.sax import parse
from xml.sax.saxutils import XMLGenerator

class Processor(XMLGenerator):
    def __init__(self, out = None, encoding = "iso-8859-1", short_empty_elements = False):
        super().__init__(out, encoding, short_empty_elements)
        self.country_name = ""

    def startElement(self, name, attrs):
        super().startElement(name, attrs)
        if name == 'country':
            self.country_name = attrs.get('name')

    def endElement(self, name):
        if name == 'country' and self.country_name == 'Singapore':
            self.characters("    ")
            self.startElement('extra', {"name": "population"})
            self.characters("main text content")
            self.endElement("extra")
            self.characters("\n    ")

        super().endElement(name)

data_processor = Processor(
    out=open('output/stream_xml_output.xml', 'w'), 
    short_empty_elements=True,
    encoding='utf-8'
)

parse('example.xml', data_processor)

