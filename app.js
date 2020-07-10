import path from 'path'
import express from 'express'
import dotenv from  'dotenv'
import connectDB from './config/db'
import morgan from 'morgan'
import exphbs from 'express-handlebars'
import router from './routes/index'

// Load config
dotenv.config({path:'./config/config.env'})

connectDB()

const app = express()

//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Handlebars
app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Routes
app.use('/', router)

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000 

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
