const fs = require('fs'); 

module.exports.default = parseObj
module.exports.parse = parseObj

const regexOperators = /[|\\{}()[\]^$+*?.]/g;
const separator = "<br><br>\n*************************\n<br><br><br>"

function parse (src, out, title)
{
	parseObj({
		srcFiles: Array.isArray(src) ? src : [src],
		outPath: out,
		title: title,
		npmPackage: require("./package.json"),
	})
}

function parseObj(options) {
	const {
		srcFiles,
		title,
		npmPackage,
		outPath = "doc-parsed.md",
		cutStart = "^^^^",
		cutEnd = "^^^^"
	}
	= options

	const extractRxStr
		= cutStart.replace(regexOperators, '\\$&')
		+ "([\\s\\S]+?)"
		+ cutEnd.replace(regexOperators, '\\$&')



	console.log("¤¤¤¤¤¤¤")
	console.log(extractRxStr)

	let output = ""
	const extractRegex = new RegExp(extractRxStr, "g")

	console.log(extractRegex)


	if (!srcFiles)
		throw new Error("Parameter error: no [srcFiles] in options")


	for (let i=0; i < srcFiles.length; i++)
	{
		const filePath = srcFiles[i]
		console.log("Reading "+filePath)
		const contents = fs.readFileSync(filePath, 'utf8')
		output += extract(filePath, contents, extractRegex)
	}

	// Write output

	console.log("End of search.")

	if (output.length === 0)
	{
		console.log("Found nothing to extract...")
		return
	}

	output = (title ? "# "+title+"\n\n" : "")
		+ getHeader(npmPackage)
		+ output

	fs.writeFileSync(outPath, output)
	console.log("Generated file "+outPath)

	/*fs.writeFile(outPath, output, function(err) {
	    if (err) throw err;
	    console.log("Generated file "+outPath)
	})*/
}

function extract(filePath, data, extractRegex) {

	let output, res, iter = 0

	do {
		res = extractRegex.exec(data)

		if (res) {
			output += separator

			if (iter === 0)
				output += getFileHeader(filePath)

			output += res[1]
		}

		iter++;

	} while(res)

	return output
}

var output = "",
	foundFiles = [], 
	extractCount = 0,
	readCount = 0,
	globEnd = false

function getHeader(package) {
	if (package) {
		return package.description
			+ "\n\n+ **package name:** " + package.name
			+ 	"\n+ **main:** " + package.main
			+ 	"\n+ **version:** " + package.version
			+ 	"\n+ **date:** " + getDateString()
			+ 	"\n+ **license:** " + package.license
			+ 	"\n+ **author:** " + package.author
			+ 	"\n\n<br><br>\n*** WORK IN PROGRESS ***\n<br>"
	}
	return "";
}

function getFileHeader(filePath) {
	return "*In file ["
		// base name
		+ filePath.replace( /^.+[\/\\]/, "" )
		+ "]("
		// relative path
		+ filePath.replace(/\\/g,"//")+")*\n"
}

function getDateString()
{
	const d = new Date()
	var str = d.getFullYear() 
			+ "/" + d.getMonth()
			+ "/" + d.getDate()

	// Padd lone numbers with zeroes "2018/3/1 -> 2018/03/01"
	str = str.replace( /\/(\d(?!\d))/g, "/0$1" )
	// Add time
	str += " " + d.toTimeString().slice(0,8)

	return str
}