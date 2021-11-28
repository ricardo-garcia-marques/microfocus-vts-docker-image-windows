var fs=require("fs"),path=require("path"),mustache=require("./mustache"),url=require("url"),connect=require("connect"),http=require("http"),querystring=require("querystring"),log=require("../log"),https=require("https"),_=require("underscore"),httpntlm=require("httpntlm");configure=null;initConfigure();test_export="undefined"!=typeof UNIT_TEST&&!0===UNIT_TEST?function(a,b){exports[a]=b}:function(){};Util={};Util.expandPath=log.expandPath;
function empty(a){return null==a||void 0==a||"string"==typeof a&&0==a.length}Util.empty=empty;Util.defEmpty=function(a,b){return empty(a)?b:a};String.prototype.format=function(){var a=arguments;return this.replace(/\{(\d+)\}/g,function(b,c){return a[c]})};
Util.copyFile=function(a,b,c){function d(a){e||(c(a),e=!0)}if(fs.existsSync(a)){fs.existsSync(b)&&fs.unlinkSync(b);var e=!1,a=fs.createReadStream(a);a.on("error",function(a){d(a)});b=fs.createWriteStream(b);b.on("error",function(a){d(a)});b.on("close",function(){d()});a.pipe(b)}else c('File "'+a+'" does not exist.')};var exec=require("child_process").exec;Util.openUrl=function(a,b){return exec('start "" "'+a.replace(/"/g,'\\"')+'"',b)};
function getTempFileName(a){for(var b="temp",c=0;16>c;c++)b+=Math.floor(16*Math.random()).toString(16);!empty(a)&&0<=a.indexOf(".")&&(a=a.substring(a.lastIndexOf(".")),b+=a);return b}Util.getTempFileName=getTempFileName;
function sendRequest(a,b,c,d){var e={hostname:"localhost",port:80,path:"/data/",headers:{Authorization:"Basic YXNkZjpmZg==","User-Agent":"VTSCMD"},method:"GET"},a=extend({port:a},e);a.path+=b;c=c||{};if("object"!==typeof c)throw"Invalid parameters, object expected";b=function(a){a.setEncoding("utf8");a.on("data",function(a){logger.info("response: "+a);d&&d(null,a)})};configure.admin.useSSL&&configure.admin.requestClientCert&&(a.cert=fs.readFileSync(c.cert),a.key=fs.readFileSync(c.key));if("NTLM"!=
configure.admin.authentication){var f=_.omit(c,"url","username","password","workstation","domain");a.path+="?"+querystring.stringify(f);!0==configure.admin.useSSL?(process.env.NODE_TLS_REJECT_UNAUTHORIZED="0",c=https.request(a,b)):c=http.request(a,b);c.on("error",function(a){d&&d(a)});c.end()}else f=_.omit(c,"url","username","password","workstation","domain"),a.domain=c.domain,a.username=c.username,a.password=c.password,!0==configure.admin.useSSL?(process.env.NODE_TLS_REJECT_UNAUTHORIZED="0",a.url=
"https://"+e.hostname+":"+a.port+a.path+"?"+querystring.stringify(f)):a.url="http://"+e.hostname+":"+a.port+a.path+"?"+querystring.stringify(f),a=_.omit(a,"headers"),httpntlm.get(a,function(a,b){if(a)return a;d&&d(null,b.body)})}function initConfigure(){if(null==configure){var a=fs.readFileSync(__dirname+"/../configure.json","utf8"),a=eval("("+a+")");configure=extend(a,{colInfoTable:"__col_info",configTable:"__config",foreverRun:!0})}}
function Globalize(){if(null==this.defaultResource){Globalize.prototype.resources={};var a=initLanguages(configure.languages);Globalize.langMapping=a[1];Globalize.langList=a[0];Globalize.prototype.defaultResource=getRawResource(Globalize.langMapping["default"]);if(null==this.defaultResource)throw Error("Cannot load the default resource");}}
Globalize.prototype.getResource=function(a){empty(a)&&(a=Globalize.langMapping["default"]);var b=this.resources[a];if(null!=b)return b;b=getRawResource(a);b=mergeResource(b,this.defaultResource);this.resources[a]=b;null==b&&(b=this.defaultResource);transformResource(b);return b};
function transformResource(a){var b=a.page.ln,c=a.page.languages;for(i=c.length-1;0<=i;i--){var d=c[i];for(ln in d){var e=d[ln];delete d[ln];d.ln=ln;d.name=e;break}empty(Globalize.langList[ln])?c.splice(i,1):d.ln==b&&(currentLanguage=d.name,a.page.currentLanguage=currentLanguage,c.splice(i,1))}}test_export("transformResource",transformResource);
Globalize.prototype.processHtml=function(a,b,c){var d=this.getContents("Web/"+b);if(empty(d))throw"Cannot read content from "+b;_view=this.getResource(c);b=mustache.render(d,_view.page);a.end(b)};Globalize.prototype.processText=function(a,b){if(empty(a))return"";"string"!=typeof a&&(a=a.toString());return mustache.render(a,b)};Globalize.prototype.getContents=Globalize.getContents=function(a){a=path.join(__dirname,a);try{return fs.readFileSync(a,"utf8")}catch(b){}};
function initLanguages(a){var b={},c={};for(i in a){var d=a[i];if("string"==typeof d)b[d]=d;else if("object"==typeof d)for(j in o=d,o)if(b[j]=j,d=o[j],"array"==typeof d)for(k in d)c[d[k]]=j;else"string"==typeof d&&(c[d]=j)}for(i in b)c[i]=i;a=configure.defaultLanguage;empty(b[a])&&(b[a]=a);c["default"]||(c["default"]=a);return[b,c]}test_export("initLanguages",initLanguages);Globalize.instance=new Globalize;
http.IncomingMessage.prototype.context=function(){this._context||(this._context=new Context(this));return this._context};http.OutgoingMessage.prototype.setcookie=function(){};function Context(a){this.ln=this.determineLn(a);this.req=a;this.resource=Globalize.instance.getResource(this.ln)}Context.prototype.processHtml=function(a,b){Globalize.instance.processHtml(a,b,this.ln)};
Context.prototype.determineLn=function(a,b){if(this._context)return this._context.ln;url.parse(a.url);var c=null;if(a.query&&(c=a.query.ln))if(c=Globalize.langMapping[c],null!=c)return b&&b.setcookie("ln",c),c;if(a.cookies&&(c=a.cookies.ln))if(c=Globalize.langMapping[c],null!=c)return c;if(a.headers&&(c=a.headers["Accept-Language"],!empty(c)))for(i in languages=c.toLowerCase().split(";"),languages)if(language=languages[i],c=Globalize.langMapping[language],!empty(c))return c;return Globalize.langMapping["default"]};
Context.prototype.getResource=function(){return this.resource};function getRawResource(a){if(empty(a)||empty(Globalize.langList[a.toLowerCase()]))return null;a=__dirname+"/resources/"+a+".json";if(!fs.existsSync(a))return null;var b=fs.readFileSync(a,"utf8");if(0==b.length)return null;var c=null;try{c=eval("("+b+")")}catch(d){logger.error("error parsing file "+a+".\r\n"+d)}return"object"!=typeof c?null:c}
function extend(a,b){null==a&&(a={});for(i in b){var c=a[i],d=b[i];"object"==typeof d?(null==c&&(c=a[i]={}),extend(c,d)):void 0==c&&(a[i]=b[i])}return a}function mergeResource(a,b){return null==a?a:extend(a,b)}test_export("mergeResource",mergeResource);
function parseCookie(a){var b={};if(empty(a))return b;for(var a=a.split(/[;,] */),c=0,d=a.length;c<d;++c){var e=a[c],f=e.indexOf("="),g=e.substr(0,f).trim(),e=e.substr(++f,e.length).trim();'"'==e[0]&&(e=e.slice(1,-1));if(void 0==b[g]){e=e.replace(/\+/g," ");try{b[g]=decodeURIComponent(e)}catch(h){if(h instanceof URIError)b[g]=e;else throw h;}}}return b}function CommandParser(){}
var enumActions={start_server:!1,delete_data:!1,"import":!0,help:!1,"?":!1,stop:!1,stop_all:!1,list:!1,info:!1,port:!0,name:!0,delimiter:!0,openui:!1,from:!0,domain:!0,username:!0,password:!0,cert:!0,key:!0};CommandParser.prototype.validators={port:function(a){a=parseInt(a,10);if(isNaN(a))throw"Invalid port value";return a},"import":function(a){a=Util.expandPath(a);a=path.resolve(a);if(!fs.existsSync(a))throw"file "+a+" does not exist";return a}};
CommandParser.prototype.parse=function(a){if(!(a instanceof Array))throw"Array parameter expected";var b=!1,c={},d=!1;for(i=0;i<a.length;i++)if(b)b=!1;else{var e=a[i];-1!=e.indexOf("vtscmd")&&(d=!0);if(0==e.indexOf("-")||0==e.indexOf("/")){var f=e.substring(1).toLowerCase(),g=!1;for(actionType in enumActions)if(0==actionType.indexOf(f)){f=actionType;b=g=enumActions[f];if(!1==g)c[f]="action";else{g=a[i+1];if(empty(g))throw'Value expected for parameter "'+f+'"';var h=this.validators[f];"function"===
typeof h&&(g=h(g,c));c[f]=g}g=!0;break}!1==g&&logger.error('Parameter "'+e+'" cannot be understood')}}if(hasAnyProperties(c,["start_server","delete_data","import"])&&Util.empty(c.port))throw"missing /port parameter";if(d&&"NTLM"==configure.admin.authentication&&(Util.empty(c.domain)||Util.empty(c.username)||Util.empty(c.password)))throw"/domain /username and /password parameters expected for NTLM authentication";if(d&&(configure.admin.useSSL&&configure.admin.requestClientCert)&&(Util.empty(c.cert)||
Util.empty(c.key)))throw"/cert and /key parameters expected for server verification";return c};function hasAnyProperties(a,b){for(i in b)if(void 0!=a[b[i]])return!0;return!1}Object.size=function(a){var b=0;for(key in a)a.hasOwnProperty(key)&&b++;return b};exports.Globalize=Globalize;exports.Context=Context;exports.extend=extend;exports.sendRequest=sendRequest;exports.initConfigure=initConfigure;exports.parseCookie=parseCookie;exports.Util=Util;exports.enumActions=enumActions;
exports.CommandParser=CommandParser;exports.enumMode={Default:"Default",NamedInstance:"NamedInstance",Commander:"Commander"};
