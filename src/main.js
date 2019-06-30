const kindlegen = require('kindlegen');
const input = require('fs');
const output = require('fs');
const fs = require('fs');
const resolve = require('path').resolve;
const execFile = require('child_process').execFileSync;
const pandoc = require('pandoc-bin').path;
const replace = require("replace");

function convertFile(parameters){
   var pandocArguments = "-o " + resolve(__dirname, parameters[0]) + " -s ";
    for (i=1; i<parameters.length; i++) {
      pandocArguments = pandocArguments + resolve(__dirname, parameters[i]) + " ";
    }
    pandocArguments = pandocArguments.trimRight().split(" ");
  execFile(pandoc, pandocArguments,{},function (err, stdout, stderr) {
    if (err) console.log(err);
  });    
}

var releaseDir = resolve(__dirname,'../release');
!fs.existsSync(releaseDir) && fs.mkdirSync(releaseDir);

replace({
  regex: "cover-image:.*",
  replacement: ("cover-image: "+resolve(__dirname,"./book/cover.jpg").replace(/\\/g,"/")),
  paths: [resolve(__dirname,'./book/sfouovo-title.yml')],
  quiet: true
});

convertFile(['../release/sfouovo.epub','./book/sfouovo-title.yml', "./book/sfouovo.md"]);
convertFile(['../release/sfouovo.txt',"./book/sfouovo-title.md","./book/sfouovo.md"]);
convertFile(['../release/sfouovo.html',"./book/sfouovo-title.md","./book/sfouovo.md"]);
convertFile(['../release/sfouovo.docx',"./book/sfouovo-title.md","./book/sfouovo.md"]);

kindlegen(input.readFileSync(resolve(__dirname,'../release/sfouovo.epub')), (err, mobi) => {
  if (err) console.log(err);
	output.writeFile(resolve(__dirname,'../release/sfouovo.mobi'),  mobi, (err) => {
    if (err) console.log(err);
	});
});
