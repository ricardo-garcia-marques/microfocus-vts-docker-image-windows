//help:
info = [
'vtscmd: the command line tool to operate on VTS locally',
'Commands:',
' /help or /?   Get help',
' /start        Start an instance, (with /port and /name)',
' /import       Import a local csv file to VTS. (with /port)',
' /delete_data  Delete all data of stored in the specified instance (with /port)',
' /stop         Stop one instance ((with /port or /name)',
' /stop_all     Stop all instances',
' /list         List the running instances',
'',

'Other parameters:',
' /port         The port number of the VTS instance',
' /delimiter    Specify the delimiter of the CSV file, used with /import',
' /name         The VTS instance name. if ignored, use the main instance',
' /domain       Specify domain for NTLM authentication',
' /username     Specify username for NTLM/Basic authentication',
' /password     Specify password for NTLM/Basic authentication',
' /cert         Specify client cert for server verification',
' /key          Specify client key for server verification',
'',

'Example:',
'1. Start VTS instance named "table_one" and listen on port 2000',
'   node vtscmd /start /port 2000 /name table_one',
'',
'2. Delete the data in VTS instance running under port 2000',
'   node vtscmd /delete_data /port 2000',
'',
'3. Import data from Customers.csv file into VTS instance running on port 2000',
'   node vtscmd /import samples/Customers.csv /port 2000'

];

var http = require('http');
var fs = require('fs');
var common = require('./admin/common');
var parser = new common.CommandParser();
var log = require('./log');
var InstanceManager = require('./admin/instmgr').InstanceManager;
var httpntlm = require('httpntlm');

var Util = common.Util;

var errorLevel = (function detectErrorLevel() {
    var params = process.argv;
    for (i in params) {
        if (params[i].indexOf('/info') === 0 || params[i].indexOf('-info') === 0) {
            return 'info';
        }
    }
    return 'warning';
})();

logger = new log.Logger({ //default value, when configure file is invalid
    "level": errorLevel,
    "transports": {
        "console": {"type": "Console"}
    }
});

//execute commands

try {
    var commands = parser.parse(process.argv);
    logger.info('parsed commands:', commands);
    executeCommand(commands);

} catch (e) {
    logger.error(e);
    showHelp();
}

var instMgr = null;

function paddingRight(value, padding) {
    padding = padding || 10;
    var paddingString = new Array(padding + 1).join(' ');
    var length = Math.max(value.toString().length, padding);
    return (value + paddingString).slice(0, padding);
}

function executeCommand(commands) {
    var port = commands.port;
    var name = commands.name = commands.name || '';
    var instOptions = { mode: common.enumMode.Commander };
	var params = { domain: commands.domain, username: commands.username, password: commands.password, cert: commands.cert, key: commands.key};
    instMgr = InstanceManager.initInstance(instOptions);
    if (commands.start_server != undefined) {
        //start server
        params.name = commands.name;
        params.port = port;
        remoteCall('start_instance', params, function (data) {
            if (data.success == false) {
                if (!Util.empty(data.msg)) logger.error(data.msg);
            }
            else {
                console.log('VTS is launched successfully');
                if (commands.openui)
                    Util.openUrl('http://localhost:' + port);
            }
        });
    }
    else if (commands.delete_data != undefined) {
        //delete all
        logger.info('delete all data');
        deleteAll(port, params);
    }
    else if (!Util.empty(commands.import)) {
        //import file
        var filename = commands.import;
        if (Util.empty(filename)) {
            logger.error('Import file is not specified yet, use /import <filename>');
            return;
        }
        importFile(port, params, filename, commands.delimiter);
    }
    else if (!Util.empty(commands.stop)) {
        //stop server
        params.name = name;
        params.port = port;
        remoteCall('stop_instance', params, function (data) {
            if (data.success == false) {
                if (!Util.empty(data.msg)) logger.error(data.msg);
            }
            else {
                console.log('VTS instance with "{0}" is stop successfully'.format( 
                    !Util.empty(name) ? 'name = {0}'.format(name) : 'port = {0}'.format(port)));
            }
        });
    }
    else if (!Util.empty(commands.stop_all)) {
        stopAllInstances(params);
    }
    else if (!Util.empty(commands.list)) {
        listInstances(params);
    }
    else if (!Util.empty(commands.help) || !Util.empty(commands['?'])) {
        showHelp();
    }
    else {
        throw "Missing command";
    }
}

//error thrown:
//1. cannot connect to server
function deleteAll(port, params) {
    //delete all data for a instance on local machine
    remoteCall('delete_all', params, function () {
            console.log('Delete successfully');
    }, port);
}

function stopAllInstances(params) {
    remoteCall('stop_all_instances', params, function (err) {
        console.log('All named instances are stopped');
    });
}

function remoteCall(method, params, callback, port) {
    var adminPort = port || configure.adminPort;
    common.sendRequest(adminPort, method, params, function (e, chunk) {
        if (e) {
            if (e.code && e.code === 'ECONNREFUSED')
                logger.error('cannot connect to VTS server, check if the "VTS Service" is started');
            else
                logger.error('problem with request: ' + e);
            return;
        }
        var data = eval('(' + chunk + ')');
        if (callback) callback(data);
    });
}

function listInstances(params) {
    remoteCall('list_instances', params, function (data) {
        if (data.success) {
            instances = data.instances;
            if (instances && instances.length > 0) {
                console.log('Running instances: ');
                for (i in instances) {
                    var rank = parseInt(i, 10);
                    console.log('{0} name: {1} port: {2}'.format(paddingRight((rank + 1) + '.', 3), paddingRight(instances[i].name, 15), instances[i].port));
                }
            }
            else {
                console.log('no running instances');
            }
        }
        else {
            logger.error(data);
        }
    });
}

//error thrown
//1. cannot connect to server
//2. file does not exist
function importFile(port, params, filePath, delimiter) {
    //copy_local_file
    var source = filePath;

    if (!fs.existsSync(source)) {
        logger.error('File "' + filePath + '" does not exist.');
        return;
    }

    var tempName = Util.getTempFileName(source);

    var target = __dirname + '/admin/Web/file/' + tempName;
    logger.info('import file ' + target);

    Util.copyFile(source, target, function (err) {
        if (!Util.empty(err)) {
            logger.error(err);
        }
        else {
            params.name = tempName;
            if (!Util.empty(delimiter)) {
                params['separator'] = delimiter;
            }
            common.sendRequest(port, 'import_local_file', params, function (e, trunk) {
                if (e) {
                    logger.error(e);
                    return;
                }
                else {
                    var obj = JSON.parse(trunk);
                    if (!obj.success) {
                        logger.error('Import failed:', obj.msg);
                    }
                    else {
                        console.log('Import successfully');
                    }
                }
            });
        }
    });
}

function showHelp() {
    console.log(info.join('\r\n'));   
}

/**
* Exports
*/
