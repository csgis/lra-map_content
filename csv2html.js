// first of all make sure we have enough arguments (exit if not)
if (process.argv.length != 5)
{
    console.error("Usage: node csv2html.js input.csv template.ejs output.html")
    console.error();
    console.error("Outputs the given template for each row in the given input.")
    console.error("Uses the first row of the CSV as column names in the template.")
    process.exit(1);
}

// now load the modules we need
var csv = require('csv'),       // library for processing CSV spreadsheet files
    ejs = require('ejs'),       // library for turning .ejs templates into .html files
    fs = require('fs'),         // node.js library for reading and writing files
    assert = require('assert'); // node.js library for testing for error conditions

// make sure EJS is configured to use curly braces for templates
ejs.open = '{{';
ejs.close = '}}';

// grab the file names from the command arguments array
// and give them more convenient names
var inputFile = process.argv[2];
var templateFile = process.argv[3];
var outputFile = process.argv[4];

// make sure each file is the right type (exit if not)
assert.ok(inputFile.lastIndexOf('csv') == (inputFile.length - 'csv'.length), "input file should be a .csv file");
assert.ok(templateFile.lastIndexOf('ejs') == (templateFile.length - 'ejs'.length), "template file should be an .ejs file");
assert.ok(outputFile.lastIndexOf('html') == (outputFile.length - 'html'.length), "output file should be an .html file");

// make sure we use the correct line-endings on Windows
var EOL = (process.platform === 'win32' ? '\r\n' : '\n')

// build the template
var template = ejs.compile(fs.readFileSync(templateFile, 'utf8'))


csv()
.fromPath(__dirname+'/'+inputFile, { columns: true })
.transform(function(data){
    // optional transform step, e.g.
    //data['Year'] = new Date(data['Date']).getUTCFullYear();
    return data;
})
.on('data',function(data,index){
    //console.log('#'+index+' '+JSON.stringify(data));
    try {
        var outLines = [];
        console.log(data);
        outLines.push(template(data));
        outputFile = "build/"+index+".html";
        fs.writeFileSync(outputFile, outLines.join(EOL + EOL), 'utf8')
    } catch (e) {
        console.error(e.stack)
    }
})
.on('end',function(count){
    console.log("done!");
})
.on('error',function(error){
    console.log(error.message);
});