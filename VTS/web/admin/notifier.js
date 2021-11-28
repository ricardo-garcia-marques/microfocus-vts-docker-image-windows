var engine=require("engine.io"),url=require("url"),NotifyMethods=Object.freeze({data_change:"data_change",config_change:"config_change"}),channelManager=function(){var c=[],a={register:function(b){logger.info("client registered");b.count=0;c.push(b)}};Object.defineProperty(a,"count",{get:function(){return c.length}});a.remove=function(){logger.info("client removed");for(var b=0;b<c.length;b++)if(c[b]){c.splice(b,1);break}};a.notifyAll=function(b){for(var a=0;a<c.length;a++){var d=c[a];d.send(JSON.stringify(b));
d.count=0}};return Object.create(a)}(),changeMonitor=function(){var c=(new Date).getTime(),a=!1,b=0,e={lastChangeTime:function(){return c},notify:function(){channelManager.notifyAll({method:NotifyMethods.data_change,data:{count:b}});b=0;a=!1},notifyConfig:function(a){channelManager.notifyAll({method:NotifyMethods.config_change,data:a})},changed:function(d){d=isNaN(d)?1:d;b+=d;c=(new Date).getTime();a||(a=!0,setTimeout(function(){e.notify()},500))}};return Object.create(e)}();
function attach(c){engine.attach(c,{path:"/engine.io"}).on("connection",function(a){logger.info("client connected, id:"+a.id);channelManager.register(a);a.on("message",function(b){a.send("echo "+b)});a.on("close",function(){channelManager.remove(a)})})}exports.changeMonitor=changeMonitor;exports.attach=attach;
