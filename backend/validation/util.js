const { validationResult } = require('express-validator/check');

const getApiErrorsFormat = ({ location, msg, param, value }) => {
    return {
        field: param,
        message: msg
    }
}

const formatErrors = (errors) => {
    if(errors.isEmpty()) {
        return {}
    }    
    const errorsAsArray = errors.array();
    const formattedErrors = {};
    errorsAsArray.forEach((error , index) => {
        if(typeof formattedErrors[error.field] === 'undefined') {
            formattedErrors[error.field] = [];
        }
        formattedErrors[error.field].push(error.message);
    })
    return formattedErrors;
}

module.exports.getErrors = req => {
    const errors = validationResult(req).formatWith(getApiErrorsFormat);
    return formatErrors(errors);
}

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports.isEmpty = isEmpty;