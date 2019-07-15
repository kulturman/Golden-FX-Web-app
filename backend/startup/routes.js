const users = require('../routes/users');
const withdraws = require('../routes/withdraws');
const fundVariations = require('../routes/fundVariations');

module.exports = (app) => {
    app.use('/api/users' , users);
    app.use('/api/withdrawals' , withdraws);
    app.use('/api/fundVariations' , fundVariations);
}