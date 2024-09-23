// npm init : pakage.json -- This is a node project.
// npm i express: ExpressJs package install hogaya --project came to know that we are using express
// We finally use express
const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


//Connect mongodb to our node app.
//mongoose.connect() takes 2 arguments : Which db connect to (db url),.2..2. Connection.options
mongoose
    .connect(
        "mongodb+srv://itmu:" +
            process.env.MONGO_PASSWORD +
            "@cluster0.4dgnf8y.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((x) => {
        console.log("Conneced to Mongo!");
    })
    .catch((err) =>{
        console.log("Error while Connecting to Mongo");

    });
//setup passport-jwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
// Update the JwtStrategy configuration with async/await
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ _id: jwt_payload.identifier });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
  



// API : GET type : / : return text "Hello World"
app.get("/",(req, res) => {
    // req contains all data for data for the request
    //res contains all data for the response
    res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

//Now we want to tell express that our server will run run on localhost: 8000 
app.listen(port, () =>{
    console.log("App is running on port " + port);
});