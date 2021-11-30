// Express framework
const express = require('express');
// For parsing bodies of the requests
const bodyParser = require('body-parser');
const multer = require('multer');
// Path operations
const path = require('path');

const database = require('./database');

// Creating the new express application
const app = express();

// Making the public folder accessible for external use
app.use(express.static(path.join(__dirname, 'public')));
// For parsing data sent from forms
app.use(bodyParser.json());
app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: true }));

// API handlers
// Sign-up request
app.post('/api/signup', (req, res) => {
  const { body } = req;
  if (
    // Checking the request parameters for existence
    !body.username || !body.password || !body.confirmPassword
    || !body.firstName || !body.lastName || !body.role
    // Checking whether username, password, first name and last name are strings
    || typeof (body.username) !== 'string'
    || typeof (body.password) !== 'string'
    || typeof (body.confirmPassword) !== 'string'
    || typeof (body.firstName) !== 'string'
    || typeof (body.lastName) !== 'string'
  ) {
    res.status(422).json({ message: 'Invalid user information' });
  } else if (body.password !== body.confirmPassword) {
    res.status(422).json({ message: 'Passwords are different' });
  } else if (!body.username.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    res.status(422).json({ message: 'Email is not valid' });
  } else {
    // Checking whether such user exists
    database.userExists(body.username, (isExists) => {
      if (isExists) {
        res.status(422).json({ message: 'Such user exists already' });
      } else {
        database.signUp(body);
        res.status(201).send();
      }
    });
  }
});

// Login request
app.post('/api/login', (req, res) => {
  const { body } = req;
  // Checking the request parameters for existence
  if (!body.login || !body.password) {
    res.status(422).json({ message: 'Invalid credentials' });
  } else {
    // Checking whether such credentials are valid
    database.login(body, (user) => {
      if (!user) {
        res.status(404)
          .json({ message: 'No such user with the given credentials' });
      } else res.status(200).json(user);
    });
  }
});

// Starting listening on the port
const port = process.env.port || 80;
app.listen(port, () => {
  console.log(`Started listening for incoming connections at the port ${port}`);
});
