import express from "express";
import session from "express-session";

const app = express();
const port = 3000;

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

// 1) Creating an new session (Route to set session data)

app.get("/set-session", (req, res) => {
  // a) Set a session variable
  req.session.username = "JohnDoe"; // We can store what we want in the session, usernames, password, loginStatus etc...

  // b) Check the Chrome, Developer tools => Application => Cookies => there is a new cookie: connect.sid  with the session token

  // c)You can send, render etc.. here
  res.send("Session data set!");
});

// NOTE If we reset the server(do some changes in the index.js and save, when we use nodemon), the session is gone and the /get-session will send "No session data found."

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
