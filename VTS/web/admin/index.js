var connect=require("connect"),url=require("url"),fs=require("fs"),path=require("path"),http=require("http"),querystring=require("querystring"),https=require("https"),data=require("./data"),common=require("./common"),root=__dirname+"/Web",notifier=require("./notifier"),InstanceManager=require("./instmgr").InstanceManager,ntlm=require("express-ntlm"),uploadFolder=root+"/file";fs.existsSync(uploadFolder)||fs.mkdirSync(uploadFolder);var users=null;
function auth(a,c,d){var b=d.connection.address();if(b&&"127.0.0.1"===b.address)for(key in d.headers)if(0===key.search(/^user-agent$/i)&&"VTSCMD"===d.headers[key])return!0;if(null==users)for(i in users={},tmp=configure.admin.users,tmp)users[tmp[i].user.toLowerCase()]=tmp[i].password;a=a.toLowerCase();return c==users[a]}
function preprocess(a,c){a.cookies=common.parseCookie(a.headers.cookie);var d=c.search;if(d){var b=d.lastIndexOf("?"),d=d.substr(0<=b?b+1:0);query=querystring.parse(d);a.query=query}}function AdminServer(a){this.options=a}AdminServer.instance=null;AdminServer.prototype.startApiServer=function(){data.createApiServer(configure.defaultApiPort,function(a){a&&logger.error(a)})};AdminServer.prototype.initChain1=function(a){this.app=a;a.use(connect.bodyParser({uploadDir:uploadFolder,keepExtensions:!0}))};
AdminServer.prototype.initChain2=function(a){var c=this.adminHandler=data.getHandler(this.options);"Basic"==configure.admin.authentication&&a.use(function(a,b,c){connect.basicAuth(function(c,b){return auth(c,b,a)})(a,b,c)});a.use(function(a,b,f){var e=url.parse(a.url);if(0==e.pathname.indexOf("/data"))f=-1,void 0!=a.headers.referer&&(f=a.headers.referer.indexOf("/port=")),-1!=f?c.change_options(common.enumMode.NamedInstance,a.headers.referer.substring(f+6)):(c.change_options(common.enumMode.Default,
configure.defaultApiPort),c.admin.options.mode=common.enumMode.Default,c.options.port=configure.defaultApiPort),preprocess(a,e),c.handle(e,a,b);else if("/"==e.pathname||0==e.pathname.indexOf("/port="))preprocess(a,e),a=a.context(),b.setHeader("Content-Type","text/html; charset=UTF-8"),a.processHtml(b,"index.tpl.html");else return f()});a.use(connect["static"](root))};
AdminServer.prototype.initServer=function(){var a=connect();a.use(connect.logger("dev"));configure.admin.useSSL&&configure.admin.requestClientCert&&a.use(function(a,d,b){if(a.client.authorized)return b();logger.error("no valid certificate for server verification");d.statusCode=495;d.end("no valid client certificate!")});"NTLM"==configure.admin.authentication&&a.use(ntlm({domain:configure.admin.domain,domaincontroller:configure.admin.domaincontroller,tlsOptions:{rejectUnauthorized:void 0!=configure.admin.LDAPSkipVerify?
!configure.admin.LDAPSkipVerify:!0}}));this.initChain1(a);this.initChain2(a);this.createHttpServer(a)};
AdminServer.prototype.createHttpServer=function(){this.server=null;if(!0==configure.admin.useSSL){var a={key:fs.readFileSync(configure.admin.privateKey),cert:fs.readFileSync(configure.admin.certificate),minVersion:configure.admin.minVersion,maxVersion:configure.admin.maxVersion,ciphers:configure.admin.ciphers,passphrase:configure.admin.passphrase};configure.admin.requestClientCert&&(a.requestCert=!0,a.rejectUnauthorized=!1,a.ca=[fs.readFileSync(configure.admin.ca)]);this.server=https.createServer(a,
this.app)}else this.server=http.createServer(this.app)};AdminServer.prototype.start=function(){var a=this.server.listen(this.options.port);notifier.attach(a);this.startApiServer()};AdminServer.createInstance=function(a){return AdminServer.instance=new AdminServer(a)};exports.getInstance=function(){return AdminServer.instance};exports.createInstance=AdminServer.createInstance;exports.startServer=function(a){a=AdminServer.createInstance(a);a.initServer();a.start()};
