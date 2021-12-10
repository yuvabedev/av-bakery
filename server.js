const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');

const port = 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

var requestValidator = require('./middleware/RequestValidator');
app.use('/', requestValidator.validateQueryStringForCustomerId);

const session = require('express-session');

var sessionOptions = {
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  resave: true
};

app.use(session(sessionOptions));

console.log("Session management initialized...");


var sessionManager = require('./middleware/SessionManager');
app.use('/', sessionManager.validateSession);


const routes = require('./routes');
//  Connect all our routes to our application
app.use('/', routes);

var customerRoutes = require('./router/CustomerRouter');
app.use('/', customerRoutes);

var orderRoutes = require('./router/OrderRouter');
app.use('/', orderRoutes);

var productManagementRoutes = require('./router/ProductManagementRouter');
app.use('/', productManagementRoutes);


var orderManagementRoutes = require('./router/OrderManagementRouter');
app.use('/', orderManagementRoutes);

var reportsRoutes = require('./router/ReportsRouter');
app.use('/', reportsRoutes);

var adminRoutes = require('./router/AdminRouter');
app.use('/', adminRoutes);

var userSessionRoutes = require('./router/SessionRouter');
app.use('/', userSessionRoutes);


app.use(express.static(path.join(__dirname, './static')));

app.get('*', function(req, res){
  res.status(404).render('404');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Express server listening on port ${port}!`);
});

require('./global.js');