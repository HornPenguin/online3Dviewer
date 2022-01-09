import os
import sys
import json
import re

from lib import tools_lib as Tools

def Main (argv):
	toolsDir = os.path.dirname (os.path.abspath (__file__))
	rootDir = os.path.dirname (toolsDir)
	os.chdir (rootDir)

	config = None
	with open (os.path.join (toolsDir, 'config.json')) as configJson:
		config = json.load (configJson)

	engineFiles = []
	sourceFolder = os.path.join (rootDir, 'source')
	for dirName in os.listdir (sourceFolder):
		dirPath = os.path.join (sourceFolder, dirName)
		if not os.path.isdir (dirPath):
			continue
		for fileName in os.listdir (dirPath):
			engineFiles.append ('source/' + dirName + '/' + fileName)

	exportedSymbols = []
	mainFileContent = ''
	for file in engineFiles:
		content = Tools.GetFileContent (file)
		matches = re.findall ('export class ([a-zA-Z0-9]+)', content)
		matches.extend (re.findall ('export function ([a-zA-Z0-9]+)', content))
		matches.extend (re.findall ('export const ([a-zA-Z0-9]+)', content))
		matches.extend (re.findall ('export let ([a-zA-Z0-9]+)', content))
		if len (matches) == 0:
			continue
		filePath = file.replace ('source/', '../source/')
		mainFileContent += 'import { ' + ', '.join (matches) + ' } from \'' + filePath + '\';\n'
		for match in matches:
			exportedSymbols.append (match)

	mainFileContent += '\nexport {\n'
	for i in range (0, len (exportedSymbols)):
		exportedSymbol = exportedSymbols[i]
		mainFileContent += '    ' + exportedSymbol
		if i < len (exportedSymbols) - 1:
			mainFileContent += ','
		mainFileContent += '\n'
	mainFileContent += '};\n'

	Tools.WriteContentToFile (os.path.join ('tools', 'engine_main.js'), mainFileContent)
	return 0

sys.exit (Main (sys.argv))
