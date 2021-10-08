var fs = require('fs') //For interacting with the file system
var cheerio = require('cheerio') //For actually parsing through the code
var cssParser = require('./cssParser.js')//For parsing css code for errors

//Variable to store errors and to store the path of the files that are going to be tested
var htmlErrors = []
var fileErrors = []
var cssErrors = []
var contentDivIds=[]
const cssPath = 'styles.css'
const htmlPaths = ['about.html','index.html','learn.html','people.html','resources.html']

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
//To use: $('parent element').existsCount('child element','count');
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
//Look for divs that arent labeled "navigation-bar" and add them to an array
        var contentDivs=[]
        if($('div').length >= 2){
            
            $('div').each(function(i, elem) {
                if($(elem).attr('id') != 'navigation-bar'){
                    contentDivs.push(elem);
                }
            });
        } else {
            htmlErrors.push(htmlPath+':It seems that you do not have at least one content "div" on this page, ensure that you created it, spelled it right, and closed the tag.\n')
        }
//Content Container div code checks
        contentDivs.forEach(div => {
            //console.log($(div).attr('class'))
    //Check if there is a div that has the class "content-container" and perform the relevant checks if there is
            if($(div).attr('class') != 'content-container'){
                htmlErrors.push(htmlPath+':It seems that one of your content divs does not have the class "content-container" applied to it, ensure that you applied the class and spelled it correctly.\n')
            }else{
        //Check for unique ids
                contentDivIds.forEach(id =>{
                    if($(div).attr('id') == id){
                        htmlErrors.push(htmlPath+':It seems that one of your content divs does not have a unique id applied to it, ensure that all of your content divs have a unique id.\n')}
                })
                if(!idExists(div)){
                    htmlErrors.push(htmlPath+':It seems that one of your content divs does not have a unique id applied to it, ensure that all of your content divs have a unique id.\n')
                }else{ contentDivIds.push($(div).attr('id')) }
        //Check for required h2
                if(!$(div).exists('h2')){
                    htmlErrors.push(htmlPath+':It seems that inside one of your content divs there is no "h2" tag, ensure that you created the tag, spelled it correctly, and closed the tag.\n')
                }
        //Check for required p tag
                if(!$(div).exists('p')){
                    htmlErrors.push(htmlPath+':It seems that inside one of your content divs there is no "p" tag, ensure that you created the tag, spelled it correctly, and closed the tag.\n')
                }
            }
        })
//Check for required additional img tag
            if(!$('body').existsCount('img',1)){
                htmlErrors.push(htmlPath+':It seems that you do not have at least 1 "img" tag, ensure that you created the tag, spelled it correctly, and closed the tag.\.\n')
            }
//Check for required ul or ol
            if(!$('body').existsCount('ul',1) || !$('body').existsCount('ol',1) ){
                htmlErrors.push(htmlPath+':It seems that you do not have at least one "ul" or "ol" tag, spelled it correctly, and closed the tag.\.\n')
            }
        if(htmlPath == "resources.html"){
            if(!$('body').existsCount('a',5) || !$('body').existsCount('link',5)){
                htmlErrors.push(htmlPath+':It seems that you do not have at least 5 "a" or "link" tags ensure that you created the tags, spelled them correctly, and closed the tags.\.\n')
            }
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
    //Check if any of the required css attributes were applied to any content sections
        contentDivIds = contentDivIds.map(id => '#' + id);
        let selectors = ['.content-container']
        selectors = selectors.concat(contentDivIds)
        var totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'padding') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"padding"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'margin') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"margin"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'border') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"border"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'color') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"color"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'background-color') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"background-color"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'font-size') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"font-size"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
        for(selector of selectors){ if(await cssParser.existsNoPrint(cssPath,selector, 'text-align') == false){ totalFalse += 1 } }
        if(totalFalse >= selectors.length){ process.stdout.write('Css Error: '+'attribute '+ '"'+"text-align"+'"' +' has not been used for any content sections.\n') }
        totalFalse = 0 
    //Return relevant error messages, 'false' means an error was detect, 'true' means the code is good
}
cssParse()
