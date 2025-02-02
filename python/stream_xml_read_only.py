import xml.sax
from xml.sax.handler import ContentHandler

class ExampleHandler(ContentHandler):
    def __init__(self):
        super().__init__()
        self.is_inside_year = False

    def startDocument(self):
        print("starting the document")

    def startElement(self, name, attrs):
        if name == "year":
            print("found the year")
            self.is_inside_year = True

    def characters(self, content):
        if self.is_inside_year:
            print("c =", content)

    def endElement(self, name):
        if name == "year":
            print("ending the year")
            self.is_inside_year = False

    def endDocument(self):
        print("ending the document")

xml.sax.parse("example.xml", ExampleHandler())

