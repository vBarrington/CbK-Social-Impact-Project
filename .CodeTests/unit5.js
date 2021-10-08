var fs = require('fs') //For interacting with the file system
var cheerio = require('cheerio') //For actually parsing through the code
var cssParser = require('./cssParser.js')//For parsing css code for errors

//Variable to store errors and to store the path of the files that are going to be tested
var htmlErrors = []
var fileErrors = []
var cssErrors = []
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
        if($('div').length <= 1){
            if($('div').attr('id') != 'navigation-bar'){
                htmlErrors.push(htmlPath+': no div with id attribute set to "navigation-bar" found.\n')
            }
        }
        if($('h2').length <= 0 && $('img').length <= 0){
            htmlErrors.push(htmlPath+': No "h2" tag  or "img" tag found, make sure you created it in the file, spelled it right, and closed the tag.\n')
        }
        if($('link').length <= 0){
            htmlErrors.push(htmlPath+': No "link" tag found, make sure you created it in the file, spelled it right, and closed the tag.\n')
        }
        if($('a').length !=5){
            htmlErrors.push(htmlPath+': It appears that you do not have 5 "a" elements on this page, make sure you create them in the file, spelled them right, and close their tags. Or that you do not have too many.\n')
        }
        if($('a').length == 5){
            let tag = $('a')
            tag.each(function(i, element){
                let cur = $(this).attr('href')
                let links = ['index.html','about.html','people.html','learn.html','resources.html']
                switch(links[i]){
                    case 'index.html':
                        if(cur == links[i]){
                            break
                        }
                    case 'about.html':
                        if(cur == links[i]){
                            break
                        }
                    case 'people.html':
                        if(cur == links[i]){
                            break
                        }
                    case 'learn.html':
                        if(cur == links[i]){
                            break
                        }
                    case 'resources.html':
                        if(cur == links[i]){
                            break
                        }
                    default:
                        htmlErrors.push(htmlPath+': No "a" tag found with href ' + links[i] + ', make sure you created it in the file, spelled it right, and closed the tag.\n')

                }
            })
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
    //Check errors for #navigation-bar
        let selector = '#navigation-bar'
        await cssParser.exists(cssPath,selector, 'background-color')
        await cssParser.exists(cssPath,selector, 'height')
        await cssParser.exists(cssPath,selector, 'padding')
    //Check errors for h1
        selector = 'a'
        await cssParser.exists(cssPath,selector, 'color')
        await cssParser.exists(cssPath,selector, 'font-family')
        await cssParser.exists(cssPath,selector, 'font-size')
        await cssParser.exists(cssPath,selector, 'padding')
        await cssParser.exists(cssPath,selector, 'margin')
        await cssParser.exists(cssPath,selector, 'border')
    //Return relevant error messages, 'false' means an error was detect, 'true' means the code is good
}
cssParse()
