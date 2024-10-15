# Node.js Session

Hi there! In this repository, I created some beginner-friendly files for sessions to help you grasp the concept of data flow and answer some questions I had when I first tried to understand this topic.

I divided the files into sections:

## Session Overview

The first section covers sessions. It provides a brief overview of the middleware, available options, how to set sessions, and how to retrieve data from them.

To test this, run the session.js file with nodemon. Just ensure that you have installed nodemon globally on your PC. You can do this with the following command:

<pre>
  <code>
npm install -g nodemon
  </code>
</pre>

Then, to run the session code, copy the files from the repository and install all the modules with:

<pre>
  <code>
npm install
  </code>
</pre>

And for the session, run:

<pre>
  <code>
nodemon session.js
  </code>
</pre>

## Session with Passport and Authentication(Strategy)

The second file demonstrates how to use sessions with password authentication strategies.

To test this, run the `passport.js` file with nodemon.

<pre>
  <code>
nodemon passport.js
  </code>
</pre>

Here, you need to import additional modules like pg for the database connection and bcrypt to hash the password.

To install the Passport module, run:

<pre>
  <code>
npm i passport
  </code>
</pre>

This installs Passport.js, a middleware for handling authentication in Node.js applications. It supports various authentication strategies.

For the local strategy, run:

<pre>
  <code>
npm i passport-local
  </code>
</pre>

This installs the local authentication strategy for Passport, allowing users to log in with a username and password. This strategy verifies user credentials against a database.
