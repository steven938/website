const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));


app.post('/form', (req, res) => {
  console.log(req.body);
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if(!emailRegexp.test(req.body.email)){
    res.status(422).send(req.body.email + " is an invalid email").end();
  };
  res.status(200);
});

app.listen(port);
