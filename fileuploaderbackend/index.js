const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./config/passport");
const dotnev  = require("dotenv")

dotnev.config()
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/google", require("./routes/googleRoutes"));
app.use("/api/dropbox", require("./routes/dropboxRoutes"));
app.use('/api/vimeo', require('./routes/vimeoRoutes'))
app.use('/api/deviantart', require('./routes/deviantartRoutes'))
app.use('/api/dribbble', require('./routes/dribbbleRoutes'))

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
