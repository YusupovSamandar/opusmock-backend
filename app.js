// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

// Body parser middleware

app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded data
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept-Type"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(bodyParser.json()); // To parse JSON data

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
