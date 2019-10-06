const users = require('../routes/users');
const withdraws = require('../routes/withdraws');
const fundVariations = require('../routes/fundVariations');
const applications = require('../routes/applications');

module.exports = (app) => {
    app.use('/api/users' , users);
    app.use('/api/withdrawals' , withdraws);
    app.use('/api/fundVariations' , fundVariations);
    app.use('/api/applications' , applications);
}