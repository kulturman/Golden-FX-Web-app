const winston = require('winston');

winston.exceptions.handle(new winston.transports.File({ filename: 'unCaughtExceptions.log' }));
process.on('unhandledRejection' , function(ex) {
    throw ex;
});

module.exports = () => {
    winston.add(new winston.transports.File({ filename: 'errors.log' }));
}