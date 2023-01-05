const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// import routes
const contractRoutes = require('./routes/contracts')
const jobsRoutes = require('./routes/jobs')
const adminRoutes = require('./routes/admin')
const balanceRoutes = require('./routes/balances')

// use middleware to get profile
app.use(getProfile)

// use contract routes
app.use('/contracts', contractRoutes)
app.use('/jobs', jobsRoutes)
app.use('/admin', adminRoutes)
app.use('/balances', balanceRoutes)

module.exports = app;
