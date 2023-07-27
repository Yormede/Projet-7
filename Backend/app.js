const express = require('express');

const app = express();

app.use(function(req, res) {
    res.status(201)
    res.json({message : 'Hello, world !'})
    console.log('Hello, world !')
});

module.exports = app;