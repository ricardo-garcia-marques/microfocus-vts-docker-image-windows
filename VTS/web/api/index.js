var apiServer = require('./lib/apiServer');
var httpServer = require('./lib/httpServer');

/**
* Exports
*/

exports.getHttpServer = function () {
    return httpServer.getInstance();
}

exports.getApiService = function () {
    var apiService = apiServer.getInstance();
    if (apiService == null) {
        throw 'apiService not initialized yet';
    }
    return apiService;
}

exports.initApiService = function (options, callback) {
    var apiService = apiServer.createInstance(options);
    if (callback) apiService.callAfterReady(callback);
    return apiService;
}