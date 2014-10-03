var esprima = require('esprima');
var acorn = require('acorn');
var fs = require('vinyl-fs');
var map = require('map-stream');



var files = [];
var esprimaOptions = {
    tolerant : true,
    loc : true
};

function withEachFile(file,next){
    storeFile(file);
    next(null,file);
}


function storeFile(file){
    if(file._contents){
        var contentString = file._contents.toString();
        try{
            files.push({
                path : file.path,
                content : contentString, // Should the next line be acorn_loose?
                ast : acorn.parse_dammit(contentString,esprimaOptions)
            });
        }
        catch(c){
            //console.warn(file.path);
        };
    }
}



module.exports.process = function(glob,callback){
    var r = fs.src(glob);
    r.pipe(map(withEachFile));
    function onAllRead(){
        callback(files);
    }
    r.on('end',onAllRead);
    return r;
};