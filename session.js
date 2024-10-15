import express from "express";

// 1) IMPORT SESSION
import session from "express-session";

// Only for the Info page, can ignore this
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//

const app = express();
const port = 3000;

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

// SESSION

// 1) Creating a new session (Route to set session data)

app.get("/set-session", (req, res) => {
  // a) Set a session variable
  req.session.username = "John Doe"; // We can store what we want in the session, usernames, password, loginStatus etc...

  // b) Check the Chrome, Developer tools => Application => Cookies => there is a new cookie: connect.sid  with the session token

  // c)You can send, render etc.. here
  res.send("Session data set!");
});

// NOTE If we reset the server(do some changes in the index.js and save, when we use nodemon), the session data is gone and the /get-session will send "No session data found."

// 2) Access the session date that we stored in the GET Request
app.get("/get-session", (req, res) => {
  // Access session data
  if (req.session.username) {
    res.send(`Hello, ${req.session.username}!`);
  } else {
    res.send("No session data found.");
  }
});

app.get("/", (req, res) => {
  res.redirect("/info");
});
app.get("/info", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
