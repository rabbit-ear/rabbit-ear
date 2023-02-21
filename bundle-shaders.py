# due to the issues around loading raw text files,
# this bundler will convert the shader files into an
# es6 Javascript file with named exports of the
# raw text as strings

# IMPORTANT! this will ignore any filenames containing
# the substring "sketch". there are a few files that
# are being worked on in development we want to ignore

import re
from os import listdir
from os.path import isfile, join

# list here the locations where shader files exist, and the
# location and filename to write the bundled named export file
sources = [{
	"read": "src/webgl/creasePattern/shaders/",
	"write": "src/webgl/creasePattern/shaders.js"
}, {
	"read": "src/webgl/foldedForm/shaders/",
	"write": "src/webgl/foldedForm/shaders.js"
}]

# convert a raw text file into a javascript string which follows this format:
# export const FILENAME = `FILECONTENTS`;
# where FILENAME is the file's name but made into a valid javascript variable
def makeNamedExport(file, path):
	f = open(join(path, file))
	# convert the file into a valid JS variable name
	variablename = re.sub("[-\.]", "_", file)
	# compress multiple consecutive newlines into just one
	contents = re.sub("[\n]{2,}", "\n", f.read())
	string = "export const " + variablename + " = `" + contents + "`;"
	f.close()
	return string

# run makeNamedExport on all files in a directory and
# join them into one large newline-separated string
def makeBundle(files, path):
	return "\n\n".join(map(lambda file: makeNamedExport(file, path), files)) + "\n"

# iterate over the locations from sources, convert them to bundles,
# save the stringified bundle as a new file
for source in sources:
	# ignore "sketch" files
	files = [f for f in listdir(source["read"]) if (isfile(join(source["read"], f)) and "sketch" not in f)]
	bundle = makeBundle(files, source["read"])
	with open(source["write"], 'w') as f:
		f.write(bundle)
