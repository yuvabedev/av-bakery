const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.redirect('/customer_search');
});

routes.get('/customer_search', (req, res) => {
  res.render('customer/search.ejs', { pageTitle: 'Search Customer' });
});

routes.get('/signup', (req, res) => {
  res.render('customer/signup.ejs', { pageTitle: 'Sign Up' });
});

module.exports = routes;
