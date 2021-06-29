const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.redirect('/customerSearch');
});

routes.get('/customerSearch', (req, res) => {
  res.render('customer/search.ejs', { pageTitle: 'Search Customer' });
});

routes.get('/signup', (req, res) => {
  res.render('customer/signup.ejs', { pageTitle: 'Sign Up' });
});

module.exports = routes;
