var fs=require("fs"),http=require("http"),path=require("path"),url=require("url"),common=require("./common"),Util=common.Util,data=require("./data");test_export="undefined"!=typeof UNIT_TEST&&!0===UNIT_TEST?function(a,b){exports[a]=b}:function(){};var diag=new Diag;test_export("getDiag",function(){return new Diag});var enableDiag=!1!==configure.enableDiag;
function extendResponse(a){a.realEnd&&(a.end=a.realEnd);a.realWrite&&(a.write=a.realWrite);var b=a.end;a.end=function(a){a instanceof HtmlHelper?b(a.tags.join("")):b(a)}}exports.diag=function(a,b,c){extendResponse(a);enableDiag||writeError(a,"Diagnostic commands are disabled");c=url.parse(c.url);c=getCommands(c.path);if(0==c.length)writeCommands(a);else{var d=c[0];c.shift();if(diag[d])diag[d](a,{qry:b,cmds:c});else writeError(a,"Invalid Command")}};
function getCommands(a){if(!Util.empty(a)){var a=a.toLowerCase(),b=a.indexOf("?");0<=b&&(a=a.substring(0,b));if(0<=a.indexOf("/data/diag/"))return a=a.substring(11).split("/"),0<a.length&&Util.empty(a[a.length-1])&&a.pop(),a}return[]}test_export("getCommands",getCommands);function getLogFiles(){var a=logger.getLogPath(),b=fs.readdirSync(a);fileInfos=[];for(i in b){filePath=path.join(a,b[i]);var c=fs.statSync(filePath);c.isDirectory()||fileInfos.push([b[i],c.size])}return fileInfos}
function sendApiRequest(a,b,c){b=http.request({port:b,host:"localhost",method:"post",path:"/api",headers:{"content-type":"application/json"}});b.end(JSON.stringify({request:JSON.stringify(a)}));b.on("response",function(a){a.on("data",function(a){c(null,JSON.parse(a.toString()))})});b.on("error",function(a){c(a)})}function createApiRequest(a,b){return{cmd:a,version:"1.0",data:b}}function wrapTagFunc(a,b){var c=a;a instanceof Array||(c=[a]);c.unshift("<"+b+">");c.push("</"+b+">");return c}
String.prototype.format=function(){var a=arguments;return this.replace(/\{(\d+)\}/g,function(b,c){return a[c]})};function HtmlHelper(a){this.tags=void 0==a?[]:formalizeTags(a)}HtmlHelper.prototype.wrapTag=function(a,b){this.tags=wrapTagFunc(this.tags,a,b);return this};HtmlHelper.prototype.appendTag=function(a){a=formalizeTags(a);this.tags=this.tags.concat(a);return this};HtmlHelper.prototype.insertTag=function(a){this.tags=formalizeTags(a).slice().concat(this.tags);return this};
function formalizeTags(a){return a instanceof Array?a:a instanceof HtmlHelper?a.tags:[a]}function writePage(a,b){var c=(new HtmlHelper('<link type="text/css" href="/data/diag/style" rel="stylesheet" />')).wrapTag("head").appendTag((new HtmlHelper(b)).wrapTag("body")).wrapTag("html").insertTag("<!DOCTYPE html>\r\n");a.end(c)}
function wrapAsLinks(a,b,c){var d=new HtmlHelper;for(i=0;i<b.length;i++){var e=b[i],e=c?c(e):'<li><a href="{0}">{1}</a></li>'.format(a+e,e);d.appendTag(e)}return d.wrapTag("ul")}function writeError(a,b){writePage(a,(new HtmlHelper("Error")).wrapTag("h1").appendTag((new HtmlHelper(b)).wrapTag("div")))}function writeCommands(a){var b=wrapAsLinks("/data/diag/",["logs"]);writePage(a,(new HtmlHelper("Diagnostic Commands")).wrapTag("h1").appendTag(b))}
function formatTable(a){if(!(a.length||0==a.length)){var b=[],c={};for(key in a){var d=a[key];for(i in d)c[i]||(c[i]=1,b.push(i))}c=new HtmlHelper;for(i=0;i<b.length;i++)c.appendTag((new HtmlHelper(b[i])).wrapTag("th"));var c=c.wrapTag("thead"),e=new HtmlHelper;for(i in a){var f=new HtmlHelper,d=a[i];for(j=0;j<b.length;j++)key=b[j],cell=void 0!=d[key]?d[key]:"","string"!=typeof cell&&(cell=cell.toString()),f.appendTag((new HtmlHelper(cell)).wrapTag("td"));e.appendTag(f.wrapTag("tr"))}e.wrapTag("tbody");
return c.appendTag(e).wrapTag("table")}}function Diag(){}Diag.prototype.meta=function(a,b){b.sys.getCache(function(b,d){var e=formatTable(d.collectionInfos);writePage(a,e)})};Diag.prototype.meta_api=function(a,b){b.sys.getCache(function(b,d){a.setHeader("Content-Type","text/plain; charset=UTF-8");a.end(JSON.stringify(d.collectionInfos,null,4))})};var BATCH_SIZE=1E3;
Diag.prototype.data=function(a,b){function c(){getOneColumnData(b.sys,d,e,BATCH_SIZE,g,function(b){if(b)return handleError(a,b);0<g.length?(a.write(JSON.stringify(g)),e+=BATCH_SIZE,g=[],c()):a.end()})}var d=b.qry.colname,e=parseInt(b.qry.start||0,10),f=qry.end?parseInt(b.qry.end,10):-1,g=[];Util.empty(d)||(-1!=f?getOneColumnData(b.sys,d,e,f-e,g,function(){a.end(g)}):c())};
Diag.prototype.api=function(a,b){var c=b.qry,d=c.cmd;Util.empty(d)&&a.end("Error:Invalid API Command");var e=JSON.parse(c.params),f=require("./instmgr").InstanceManager.Instance;data.getApiServerConfig(b.sys,function(b,c){port=f.mode==common.enumMode.NamedInstance?f.port:c.port?c.port:8888;var k=createApiRequest(d,e);sendApiRequest(k,port,function(b,c){var d={};d.request=JSON.stringify(k,null,4);b?d.err=JSON.stringify(b):d.response=JSON.stringify(c,null,4);a.end(JSON.stringify(d))})})};
Diag.prototype.apis=function(a){a.setHeader("Content-Type","text/html; charset=UTF-8");fs.createReadStream(path.join(__dirname,"apidiag"),{encoding:"utf8"}).pipe(a)};
Diag.prototype.logs=function(a,b){if(0==b.cmds.length){var c=getLogFiles(),c=wrapAsLinks("/data/diag/logs/",c,function(a){return'<li><a href="{0}">{1}</a>  ({2}KB)</li>'.format("/data/diag/logs/"+a[0],a[0],Math.ceil(a[1]/1024))});writePage(a,c)}else{var d=null;Util.empty(b.qry.filter)||(d=b.qry.filter);c=b.cmds[0];if(0<c.indexOf(".."))a.end();else if(c=path.join(logger.getLogPath(),c),fs.existsSync(c)){var c=fs.createReadStream(c,{encoding:"utf8"}),e=new HtmlHelper;e.appendTag('<table style="border:1px solid"><thead><th>Number</th><th style="width:3em">Level</th><th>Time Stamp</th><th>Message</th></tr>');
var f=null,g=0;c.addListener("data",function(a){if(!(1E3<g)){a=a.split("\n");null!=f&&(a[0]=f+a[0]);for(i=0;i<a.length;i++){try{var b=JSON.parse(a[i]);f=null}catch(c){f=a[i];continue}var h=null;if(!(null!=d&&b.level!=d)){"error"==b.level&&(h='class="error"');"warning"==b.level&&(h='class="warning"');if(1E3<g){e.appendTag('<tr {3}><td colspan="4">More...</td></tr>');break}e.appendTag("<tr {4}><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>".format(g++,b.level,b.timestamp,b.message.replace(/<|>/g,
" "),h))}}}});c.addListener("end",function(){e.appendTag("</table>");writePage(a,e)});c.addListener("error",function(b){a.end("Error:"+b)})}else a.end("File does not exist.")}};Diag.prototype.style=function(a){enableDiag&&a.setHeader("Content-Type","text/css; charset=UTF-8");a.end("h1 {font-size:1.2em;}\ntable {border-collapse:collapse;}\ntd,th {border:1px solid;padding: 0 5px;}\n.error {color:red;}\nli {white-space:nowrap;}\n")};exports.sendApiRequest=sendApiRequest;exports.createApiRequest=createApiRequest;