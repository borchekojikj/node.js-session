import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
// 1) IMPORT SESSION
import session from "express-session";
import dotenv from "dotenv";

// 2) IMPORT PASSPORT
import passport from "passport";
// 3) IMPORT THE LOCAL STRATEGY, so that we can create it
import { Strategy as LocalStrategy } from "passport-local";

// Only for the Info page, can ignore this
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
// Config env variables
dotenv.config({ path: "./config.env" });

// Connect to Database
const db = new pg.Client({
  user: process.env.DB_USERNAME, // postgres
  host: process.env.DB_HOST, // localhost
  database: process.env.DB_DATABASE, // secrets
  password: process.env.DB_PASSWORD, // You Database password
  port: process.env.DB_PORT, // 5432
});
db.connect();

const app = express();
const port = 3000;
const saltRounds = 10;

// Body Parser
app.use(express.urlencoded({ extended: true }));

// Set up the session middleware
app.use(
  session({
    secret: "TOPSECRETWORD", // You can use what you want!
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Render Home Page
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Render Login Page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Render Register Page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Process Login
app.post(
  "/login",
  // use the Local Strategy to Authenticate the user
  passport.authenticate("local", {
    successRedirect: "/secrets", // Redirect to /secrets
    failureRedirect: "/login",
  })
);

// Process Register
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      // Hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = newUser.rows[0];

          req.login(user, (err) => {
            if (err) return console.log(err);
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// This function determines which data from the user object should be stored in the session. Typically, this includes the user ID.
// You can think of it like packing the user in a box and putting a label on it.

passport.serializeUser((user, cb) => {
  cb(null, user);
});

// This function is used to retrieve the full user object from the session data. When a request is made, Passport uses the user ID stored in the session to fetch the user object.
// Here, you find the box(Session) with the specific label(userID) and unpack it.
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Page to access only when logged in
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("./secrets.ejs");
  } else {
    res.redirect("/login");
  }
});

// Set the Strategy so that passport can use it in the login route!
// Registering the strategy
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      // Guard if the user is not Found! Return the callback with user not found!
      if (!result.rows.length > 0) return cb("USer not found!");

      const user = result.rows[0];
      const storedHashedPassword = user.password;
      // Check if the password is correct
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) return cb(err);

        // Guard for result, if there is no result !result, return cb
        if (!result) return cb(null, false);

        // If everything is okej, return no error and the user
        return cb(null, user);
      });
    } catch (err) {
      return cb(err);
    }
  })
);

app.get("/info", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
