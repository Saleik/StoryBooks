import path from "path";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import exphbs from "express-handlebars";
import methodOverride from 'method-override'
import index from "./routes/index";
import auth from "./routes/auth";
import stories from "./routes/stories";
import passport from "passport";
import session from "express-session";
import MongoConnect from "connect-mongo";
import connectDB from "./data/db";

// Load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

connectDB();

const app = express();

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebars helpers
import { formDate, truncate, stripTags, editIcon, select } from "./helpers/hbs";
//Handlebars
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
        formDate,
        truncate,
        stripTags,
        editIcon,
        select
    },
  })
);
app.set("view engine", ".hbs");

//Sessions
const MongooseStore = MongoConnect(session);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongooseStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: false }, //Set at true if you work in "https" environment
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global var
app.use((req, res, next)=>{
    res.locals.user = req.user || null 
    next()
})

//Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

//Static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
