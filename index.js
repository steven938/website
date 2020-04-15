const express = require('express');
const app = express();
const path = require('path');
const favicon = require('express-favicon');
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + '/client/public/favicon.ico'));
let bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/app', (req, res) => {
  res.send("backend call")
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.send("hello world")
  // res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port);
