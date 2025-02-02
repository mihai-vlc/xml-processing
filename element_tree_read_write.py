from xml.etree.ElementTree import parse, Element

tree = parse("example.xml")

for year in tree.findall(".//year"):
    print(year.tag, year.text)


for val in tree.findall(".//country[@name]"): # all countries with a name attribute
    print(val)

for val in tree.findall(".//country[@name='Singapore']"): # all countries where the name attribute is Singapore
    print(val)
    el = Element('extra', name="population")
    el.text = "main text content"
    el.tail = "\n    "
    
    val.append(el)

for val in tree.findall(".//country[@name='Singapore']"): # all countries where the name attribute is Singapore
    print(val, 'singapore found')



tree.write('output/element_tree_output.xml')



