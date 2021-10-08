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
        if($('div').length <= 0){
            htmlErrors.push(htmlPath+': No "div" tag found, make sure you created it in the file, spelled it right, and closed the tag.\n')
        }
        if($('div').length <= 1){
            if($('div').attr('class') != 'landing-section'){
                htmlErrors.push(htmlPath+': class attribute in div not set to "landing section"\n')
            }
            switch(htmlPath){
                case 'index.html':
                        if($('div').attr('id') != 'home-landing'){
                            htmlErrors.push(htmlPath+': id attribute in div not set to "home-landing"\n')
                        }
                    break;
                case 'about.html':
                        if($('div').attr('id') != 'about-landing'){
                            htmlErrors.push(htmlPath+': id attribute in div not set to "about-landing"\n')
                        }
                    break;
                case 'people.html':
                        if($('div').attr('id') != 'people-landing'){
                            htmlErrors.push(htmlPath+': id attribute in div not set to "people-landing"\n')
                        }
                    break;
                case 'learn.html':
                        if($('div').attr('id') != 'learn-landing'){
                            htmlErrors.push(htmlPath+': id attribute in div not set to "learn-landing"\n')
                        }
                    break;
                case 'resources.html':
                        if($('div').attr('id') != 'resources-landing'){
                            htmlErrors.push(htmlPath+': id attribute in div not set to "resources-landing"\n')
                        }
                    break;
            }
        }
        if($('h1').length <= 0){
            htmlErrors.push(htmlPath+': No "h1" tag found, make sure you created it in the file, spelled it right, and closed the tag.\n')
        }
        if($('link').length <= 0){
            htmlErrors.push(htmlPath+': No "link" tag found, make sure you created it in the file, spelled it right, and closed the tag.\n')
        }
        $('link').each((i, link) => {
            const href = link.attribs.href.toLowerCase()
            if(href.startsWith('https://fonts.googleapis.com/') == true){
                googleFont = true;
            }
        })
        if(googleFont == false){
            htmlErrors.push(htmlPath+': No link tag found with google fonts api in file. Make sure you created the tag and that the link begins with "https://fonts.googleapis.com/"\n')
        }
        if($('head').length <= 0){
            htmlErrors.push(htmlPath+': No head tag found\n')
        }
        if($('title').length <= 0){
            htmlErrors.push(htmlPath+': No title tag found\n')
        }
        if($('body').length <= 0){
            htmlErrors.push(htmlPath+': No body tag found\n')
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
    let selectors = ['#home-landing','#about-landing', '#people-landing','#learn-landing','#resources-landing']
    for(const selector in selectors){
        //Check for errors for ID's
        cssErrors[0] = await cssParser.exists(cssPath, selectors[selector], 'background-image')
        if(cssErrors[0] == false){
            process.stdout.write('Css Error: '+'attribute "background-image" cannot be found for '+selectors[selector]+'\n')}
    }
    //Check errors for landing-section
        let selector = '.landing-section'
        cssErrors[0] = await cssParser.exists(cssPath,selector, 'width')
        cssErrors[1] = await cssParser.exists(cssPath,selector, 'height')
        cssErrors[2] = await cssParser.exists(cssPath,selector, 'border')
        cssErrors[3] = await cssParser.exists(cssPath,selector, 'background-size')
        cssErrors[4] = await cssParser.exists(cssPath,selector, 'background-repeat')
    //Check errors for h1
        selector = 'h1'
        cssErrors[0] = await cssParser.exists(cssPath,selector, 'color')
        cssErrors[1] = await cssParser.exists(cssPath,selector, 'font-family')
        cssErrors[2] = await cssParser.exists(cssPath,selector, 'padding')
}
cssParse()
