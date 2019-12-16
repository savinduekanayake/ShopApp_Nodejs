const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')

const app = express();

// dynamic template
app.set('view engine','pug');
app.set('views','views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminData.routes);
app.use(shopRoutes);


// not a regular page
app.use('/',(req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page not found'});
});


app.listen(3000);
