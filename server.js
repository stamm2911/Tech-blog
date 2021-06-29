// Importing libraries to use
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Importing routes to use  
const routes = require('./controllers');
// Impoting file to use sequelize and connect to the db
const sequelize = require('./config/connection');
// Importing custome handlebars helpers
const helpers = require('./utils/helpers');

// Initializing Express 
const app = express();

// Setting the PORT
const PORT = process.env.PORT || 3001;

// Set up session with cookies
const sess = {
    secret: 'Super secret',
    cookie:{},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    })
};

app.use(session(sess));

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Telling Express to use the routes 
app.use(routes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initializing the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});