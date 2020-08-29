const express = require('express');
const db = require('./util/database');
// const expressHandleBars = require('express-handlebars'); 
const bodyParser = require('body-parser');

const path = require('path');
const rootDir = require('./util/path');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


const app = express();

/**
 * handlebars is used as template engine to render dynamic data in html pages
 */

/**
 * Below code is used when we have to use handlebars as template engine
 */


// app.engine('hbs', expressHandleBars({
//     layoutsDir: 'views/layouts/', 
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



app.listen(3001, () => {
    console.log('Server started successfully at port: 3000')
});