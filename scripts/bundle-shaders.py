# due to the difficulty around loading raw text files in js,
# this bundler will convert the shader files into a large
# es6 js file with named exports of the raw text as strings.
#
# run this from the root dir, ie: python3 shaders/bundle-shaders.py
# the paths below are expecting this.

import re
from os import listdir
from os.path import isfile, join

# list here the locations where shader files exist, and the
# location and filename to write the bundled named export file
sources = [{
	"read": "./src/webgl/creasePattern/shaders/",
	"write": "./src/webgl/creasePattern/shaders.js"
}, {
	"read": "./src/webgl/foldedForm/shaders/",
	"write": "./src/webgl/foldedForm/shaders.js"
}, {
	"read": "./src/webgl/touches/shaders/",
	"write": "./src/webgl/touches/shaders.js"
}]

# convert a raw text file into a javascript string which follows this format:
# export const FILENAME = `FILECONTENTS`;
# where FILENAME is the file's name but made into a valid javascript variable
def makeNamedExport(file, path):
	# sometimes .DS_Store will try to get involved
	try:
		f = open(join(path, file))
		# convert the file into a valid JS variable name
		variablename = re.sub("[-\.]", "_", file)
		# compress multiple consecutive newlines into just one
		contents = re.sub("[\n]{2,}", "\n", f.read())
		string = "export const " + variablename + " = `" + contents + "`;"
		f.close()
		return string
	except:
		return ""

# run makeNamedExport on all files in a directory and
# join them into one large newline-separated string
def makeBundle(files, path):
	return "\n\n".join(map(lambda file: makeNamedExport(file, path), files)) + "\n"

# iterate over the locations from sources, convert them to bundles,
# save the stringified bundle as a new file
for source in sources:
	files = [f for f in listdir(source["read"]) if isfile(join(source["read"], f))]
	bundle = makeBundle(files, source["read"])
	with open(source["write"], 'w') as f:
		f.write(bundle)
