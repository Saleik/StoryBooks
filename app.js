import path from 'path'
import express from 'express'
import dotenv from  'dotenv'
import morgan from 'morgan'
import exphbs from 'express-handlebars'
import index from './routes/index'
import auth from './routes/auth'
import passport from 'passport'
import session from 'express-session'
import connectDB from './data/db'

// Load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Sessions
app.set('http://localhost:3000', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', index)
app.use('/auth', auth)

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000 

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
