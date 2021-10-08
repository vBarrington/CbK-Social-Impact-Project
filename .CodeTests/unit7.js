var fs = require('fs') //For interacting with the file system
var cheerio = require('cheerio') //For actually parsing through the code
var cssParser = require('./cssParser.js')//For parsing css code for errors

//Variable to store errors and to store the path of the files that are going to be tested
var htmlErrors = []
var fileErrors = []
var cssErrors = []
const cssPath = 'styles.css'
const htmlPaths = ['about.html']
//TODO Check for #biography in html
//TODO check for #hobbies in html
//TODO check for #favorites in html
//TODO Check for #biography in css
//TODO check for #hobbies in css
//TODO check for #favorites in css
//Testing procedures for html go in this for loop
htmlPaths.forEach(htmlPath => {
    //Check that each file exists
    if (!fs.existsSync(htmlPath)){
        fileErrors.push(htmlPath+ ' does not exist\n')
    }
    //Loading cheerio and using it to check for relevant tags
    else{
        let googleFont = false
        const $ = cheerio.load(fs.readFileSync(htmlPath), {
            ignoreWhitespace: true,
            xmlMode: true,
            _useHtmlParser2: true,
            withStartIndices: true,
            decodeEntities: true,
            recognizeSelfClosing: false,
        });
        var doctype = ($.root().html());
        doctype = doctype.toLowerCase()
        doctype = doctype.slice(0,15)
        if(doctype != '<!doctype html>'){
            htmlErrors.push(htmlPath+': Doctype not found\n')
        }
        //Function to check if a nested element exists
        //To use: $('parent element').exists('child element');
        //Returns false if element does not exist
        $.prototype.exists = function (selector) {
              return this.find(selector).length > 0;
        }
        //Function to check if a number of nested elements exist
        //To use: $('parent element').exists('child element','count');
        //Returns false if element does not exist
        $.prototype.existsCount = function (selector, count) {
              return this.find(selector).length >= count;
        }
        //Function to check if a nested element has a class attribute
        //To use: classExists('element');
        //Returns false if class is not found
        const classExists = function(selector){
            if($(selector).attr('class') == undefined || $(selector).attr('class') <= 0){
                return false
            }else{ return true }
        }
        //Function to check if a nested element has a id attribute
        //To use: idExists('element');
        //Returns false if id is not found
        const idExists = function(selector){
            if($(selector).attr('id') == undefined || $(selector).attr('id') <= 0){
                return false
            }else{ return true }
        }

        if( idExists('#biography') == false ){
            htmlErrors.push(htmlPath+': no section with the id "biography" found.\n')
        }
        if( idExists('#hobbies') == false ){
            htmlErrors.push(htmlPath+': no section with the id "hobbies" found.\n')
        }
        if( idExists('#favorites') == false ){
            htmlErrors.push(htmlPath+': no section with the id "favorites" found.\n')
        }

    if(htmlErrors.length <= 0) {
        console.log(htmlPath+': No Errors in html code checked.');
    }
    else{
        htmlErrors.forEach(error => process.stdout.write(error))
    }
        
    }
})

//Print errors if there are any
if(fileErrors.length > 0) {
    fileErrors.forEach(error => process.stdout.write(error))
}

/*Testing procedures for css go in this function
 * Note that each function call has an "await"
 * This is necessary to ensure the code actually
 * returns something and functions properly
*/
var cssParse = async () =>{
    //Search for errors
    await cssParser.tagExists(cssPath,'#biography')
    await cssParser.tagExists(cssPath,'#hobbies')
    await cssParser.tagExists(cssPath,'#favorites')
    //Return relevant error messages, 'false' means an error was detect, 'true' means the code is good
}
cssParse()
