//Reads input files line by line
const lineReader = require('line-reader')

//Used to edit the attribute strings to ensure matching formats
function escapeRegExp(stringToGoIntoTheRegex) {
    stringToGoIntoTheRegex = stringToGoIntoTheRegex.replace(/ /g,"")
    stringToGoIntoTheRegex = stringToGoIntoTheRegex.replace(/;/g,"")
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

//Regular expression used to edit strings to ensure matching formats
var cssOpen = new RegExp('([\\s\\S]*?){', 'gi');//([\\s\\S]*?)}', 'gi');

//I believe this is deprecated but leaving for fear that it's still being used somewhere, don't use this one
exports.parse = async (file, tag, attr) => {
    var tagSearched = escapeRegExp(tag + "{" );
    var tagFound = false;
    var attrSearched = escapeRegExp(attr);
    var promise = new Promise((resolve, reject) =>{
        lineReader.eachLine(file, (line, last) =>{
            if(line.includes('{')){
                if(escapeRegExp(line) === tagSearched){
                    tagFound = true;
                }
            }
            //If the tag is found and the attributes match return true
            if(tagFound === true){
                if(attrSearched == escapeRegExp(line)){
                    resolve(true)
                }
            }
            //If the tag is found and the attribute is not return false
            if(tagFound === true && line.includes('}')){
                reject(false)
            }
            //If the tag is not found return false
            if(last){
                reject(false)
            }
        })
    }).then(() => {
        cssValid = true
        return true
    }).catch(() => {
        return false
    })
    var result = await promise;
    return result
}
//Checks if a css selector has the correct attribute
exports.exists = async (file, tag, attr) => {
    var tagSearched = escapeRegExp(tag + "{" );
    var tagFound = false;
    var attrSearched = escapeRegExp(attr);
    var promise = new Promise((resolve, reject) =>{
        lineReader.eachLine(file, (line, last) =>{
            if(line.includes('{')){
                if(escapeRegExp(line) === tagSearched){
                    tagFound = true;
                }
            }
            //If the tag is found and the attribute exists return true
            if(tagFound === true){
                if(escapeRegExp(line).startsWith(attrSearched)){
                    //console.log("orig: "+escapeRegExp(line) )
                    //console.log("sear: "+attrSearched )
                    resolve(true)
                }
            }
            //If the tag is found and the attribute is not return false
            if(tagFound === true && line.includes('}')){
                reject(false)
            }
            //If the tag is not found return false
            if(last){
                reject(false)
            }
        })
    }).then(() => {
        cssValid = true
        return true
    }).catch(() => {
        return false
    })
    var result = await promise;
    if(result == false){
        process.stdout.write('Css Error: '+'attribute '+ '"'+attr+'"' +' cannot be found for css selector: '+tag+'\n')
    }
    return result
}
//The same as "exists" but does not print the output
exports.existsNoPrint = async (file, tag, attr) => {
    var tagSearched = escapeRegExp(tag + "{" );
    var tagFound = false;
    var attrSearched = escapeRegExp(attr);
    var promise = new Promise((resolve, reject) =>{
        lineReader.eachLine(file, (line, last) =>{
            if(line.includes('{')){
                if(escapeRegExp(line) === tagSearched){
                    tagFound = true;
                }
            }
            //If the tag is found and the attribute exists return true
            if(tagFound === true){
                if(escapeRegExp(line).startsWith(attrSearched)){
                    //console.log("orig: "+escapeRegExp(line) )
                    //console.log("sear: "+attrSearched )
                    resolve(true)
                }
            }
            //If the tag is found and the attribute is not return false
            if(tagFound === true && line.includes('}')){
                reject(false)
            }
            //If the tag is not found return false
            if(last){
                reject(false)
            }
        })
    }).then(() => {
        cssValid = true
        return true
    }).catch(() => {
        return false
    })
    var result = await promise;
    if(result == false){
    }
    return result
}
//Checks for a css selector in the file
exports.tagExists = async (file, tag) => {
    var tagSearched = escapeRegExp(tag + "{" );
    var tagFound = false;
    var promise = new Promise((resolve, reject) =>{
        lineReader.eachLine(file, (line, last) =>{
            if(line.includes('{')){
                if(escapeRegExp(line) === tagSearched){
                    tagFound = true;
                }
            }
            //If the tag is found return true
            if(tagFound === true){
                resolve(true)
            } 
            //If the tag is not found return false
            if(last){
                reject(false)
            }
        })
    }).then(() => {
        cssValid = true
        return true
    }).catch(() => {
        return false
    })
    var result = await promise;
    if(result == false){
        process.stdout.write('Css Error: css selector "'+tag+'" could not be found\n')
    }
    return result
}
// exports.applied = async (file, tags, attr) => {
//     var count = tags.length
//     var totalFalse = 0;
//     for(const tag of tags){
//         const result = await module.exports.existsNoPrint(file, tag ,attr)
//         if(result == false){totalFalse += 1}
//     }
//     tags.forEach(tag => {
//         await module.exports.existsNoPrint(file, tag ,attr)
//     })
// }
/* Use Cases
 * The tag is correct and the attribute is correct
 * The tag is correct and the attribute is not
 * There is a correct attribute but not a tag
 * There is no tag
 * There is a tag but no attribute
 */
