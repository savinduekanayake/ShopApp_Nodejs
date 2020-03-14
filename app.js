const express = require('express');
const bodyPaser = require('body-parser');
const path = require('path');
const parser = require('parse')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');



const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

const MONGODB_URL = 'mongodb://savindu:yzQHPrSRuimRVRW6@cluster0-shard-00-00-r106v.mongodb.net:27017,cluster0-shard-00-01-r106v.mongodb.net:27017,cluster0-shard-00-02-r106v.mongodb.net:27017/shop?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&w=majority';
// const MONGODB_URL = 'mongodb://savindu:yzQHPrSRuimRVRW6@cluster0-shard-00-00-r106v.mongodb.net:27017,cluster0-shard-00-01-r106v.mongodb.net:27017,cluster0-shard-00-02-r106v.mongodb.net:27017/shop?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri:MONGODB_URL,
    collection:'sessios'
});

//default settings for csrdToken
const csrfProtection = csrf();

app.set('view engine', 'ejs')
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyPaser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized:false, 
    store:store
    })
); //sigin the hash(secret)

app.use(csrfProtection);
//registor flash
app.use(flash());

// this is only for views. no need to hard code in all views
app.use((req,res,next)=>{ 
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken()
    next();

})

//session setting to user
app.use((req,res,next)=>{
    
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=>{
        // throw new Error('fsaf')
        if(!user){
            return next();
        }
        req.user= user;
        next();
    })
    .catch(err=>{
        next(new Error(err)); // inside async code need to use next
    });
}); 




app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


//error occured
app.get('/500',errorController.get500);

// not a regular page
app.use('/',errorController.get404);

app.use((error,req,res,next)=>{
    // res.redirect('/500');
    res.status(500).render('500' ,{
        pageTitle:'Error!',
        path:'/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

// mongoConnect(()=>{
//     // console.log()
     
//     app.listen(3000);
// })

mongoose
    .connect(MONGODB_URL,{useUnifiedTopology: true,useNewUrlParser: true,})
    .then((result)=>{
        console.log('CONNECTED!');
        app.listen(3000);
    }).catch(err=>{
        console.log(err);
    })
