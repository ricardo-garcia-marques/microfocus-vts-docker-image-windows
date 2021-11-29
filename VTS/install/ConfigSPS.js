



function updateConfig(path, adminPort, dbPath){
  var fs = require('fs');
  var config = fs.readFileSync(path, 'utf8');
  adminPort = parseInt(adminPort);
  if(!isNaN(adminPort)) {
    config = config.replace(/"adminPort": \d+,/, '"adminPort": ' + adminPort + ',');
    config = config.replace(/"dbPath": .+,/, '"dbPath": "' + dbPath.replace(/\\/g,'/') + '",');
  }
  fs.writeFileSync(path, config);
}

function CScriptUtil(){
  var fs = new ActiveXObject("Scripting.FileSystemObject");
  function deleteFile (path){
    if(fs.FileExists(path)){
      fs.DeleteFile(path);
    }
  }

  function createFolder(path){
    var parts = path.split('\\');
    var path = '';
    for(var i = 0; i < parts.length; ++i){
      path += parts[i] + '\\';
      if(!fs.FolderExists(path))
        fs.CreateFolder(path);
    }
  }

  var WshShell = new ActiveXObject("WScript.Shell");
  var startMenuDir = WshShell.SpecialFolders("AllUsersStartMenu");
  var shortcutDir = startMenuDir + '\\Programs\\Micro Focus\\Virtual Table Server';

  function createShortcut(path, target){
    var oShellLink = WshShell.CreateShortcut(path);
    oShellLink.TargetPath = target;
    oShellLink.Save();
  }

  this.createShortcut = function(name, target){
    createFolder(shortcutDir);
    createShortcut(shortcutDir + '\\' + name, target);
  }

  this.deleteShortcut = function(name){
    deleteFile(shortcutDir + '\\' + name);
  }
}


var command={
  configure:function(path, adminPort, dbPath){
    updateConfig(path, adminPort, dbPath);
  },
  createShortcut:function(name, target){
    new CScriptUtil().createShortcut(name, target);
  },
  deleteShortcut:function(name){
    new CScriptUtil().deleteShortcut(name);
  }
}

function handleCommand (args) {
  var commandName = args[0];
  if(command[commandName] !== undefined){
    command[commandName].apply(null, args.slice(1));
  }
}

function main(){
  var argv = [];
  if(typeof process === 'undefined')
  {
    for(var i = 0; i < WScript.Arguments.length; ++i){
      argv[i] = WScript.Arguments.Item(i);
    }
  }
  else
    argv = Array.prototype.slice.call(process.argv, 2);
  handleCommand(argv);
}

main();