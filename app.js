require("dotenv/config");
const path = require("node:path");
const express = require("express");
const app = express();

const session = require("express-session");
const passport = require("./config/passport");

const authRoutes = require("./routes/authRoutes");

app.set("views", path.join(__dirname, "views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:false}));
app.use(
    session({ 
        secret: process.env.SESSION_SECRET || "dev-secret-change-me", 
        resave: false, 
        saveUninitialized: false 
    })
);

app.use(passport.initialize());
app.use(passport.session());


//routes
app.use("/",authRoutes);


app.listen(process.env.PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});