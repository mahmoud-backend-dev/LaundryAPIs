const authRoute = require('./authRoute');
const dailyRoute = require('./dailyRoute')
const monthlyRoute = require('./monthlyRoute')
const specialRoute = require('./specialRoute')
const yearlyRoute = require('./yearlyRoute')

const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoute)
  app.use('/api/v1/bookingDaily', dailyRoute);
  app.use('/api/v1/bookingMonthly', monthlyRoute);
  app.use('/api/v1/bookingSpecial', specialRoute);
  app.use('/api/v1/bookingYearly', yearlyRoute);
};

module.exports = mountRoutes;