// get json file (config.json)
// './' - in this directory
var configValues = require('./config');

module.exports = {

    getDbConnectionString: function () {
        // connection to db on mlab.com
        return 'mongodb://' + configValues.uname + ':' + configValues.pwd + '@xx00000.mlab.com:12345/mongolabdb';
    }

}