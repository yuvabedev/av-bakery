const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');

const port = 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

const routes = require('./routes');
//  Connect all our routes to our application
app.use('/', routes);

var customerRoutes = require('./controller/customer');
app.use('/', customerRoutes);

app.use(express.static(path.join(__dirname, './static')));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Express server listening on port ${port}!`);
});
