const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");
const lessonDir = path.resolve(__dirname, "..");
const inputPath = path.join(lessonDir, "Lesson_22_Letters_to_Editor_Reading_Article.html");
const outputPath = path.join(lessonDir, "Lesson_22_Letters_to_Editor_Reading_Article.pdf");
async function main(){
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
    page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});page.on("pageerror",e=>errors.push(e.message));
    await page.goto(pathToFileURL(inputPath).href,{waitUntil:"networkidle"});await page.emulateMedia({media:"print"});
    const audit=await page.evaluate(()=>({pages:document.querySelectorAll('.page').length,overflow:[...document.querySelectorAll('.page')].map((p,i)=>({page:i+1,x:p.scrollWidth-p.clientWidth,y:p.scrollHeight-p.clientHeight})).filter(v=>v.x>1||v.y>1)}));
    if(audit.pages!==4)throw new Error(`Expected four pages, found ${audit.pages}`);if(audit.overflow.length)throw new Error(`Overflow: ${JSON.stringify(audit.overflow)}`);if(errors.length)throw new Error(errors.join(' | '));
    await page.pdf({path:outputPath,format:"A4",preferCSSPageSize:true,printBackground:true,tagged:true,outline:true,margin:{top:"0",right:"0",bottom:"0",left:"0"}});
    console.log("PASS: four A4 pages, no overflow, no browser errors.");
  }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
