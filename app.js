// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require("socket.io");
const { add, skipCandidate } = require("./custom/addData");
const fs = require('fs');

const path = require('path');

const io = socketIO(server, {
    cors: {
        origin: "*"
    }
});

// custom

const { moveFromPendingToComplete } = require("./custom/addData")

// Routes

const { addCandidate, getPending } = require("./routes/candidates");
const { addExaminer, removeExaminer, getExaminers } = require("./routes/examiners");

const port = process.env.PORT || 4000;

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

app.use(cors({ origin: "*" }));

app.use(bodyParser.json()); // To parse JSON data

app.post("/candidate", addCandidate);
app.get("/all", getPending);
app.get("/examiners", getExaminers);
app.post("/examiners", addExaminer);
app.delete("/examiners", removeExaminer);



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("candidate-called", (obj) => {
        // call candidate
        const caller = JSON.parse(obj)
        const response = moveFromPendingToComplete(caller);

        io.to(socket.id).emit("alert", response);
        if (response) {
            io.emit("ring", response, caller);
        }


        const filePath = path.join(__dirname, './data.json');
        const jsonData = JSON.parse(fs.readFileSync(filePath));

        io.emit("update-candidates", jsonData);
    });

    socket.on("skip-candidate", (obj) => {
        // call candidate
        const response = skipCandidate(obj);



        if (response) {
            const filePath = path.join(__dirname, './data.json');
            const jsonData = JSON.parse(fs.readFileSync(filePath));

            io.to(socket.id).emit("skipped", obj.id);
            io.emit("update-candidates", jsonData);
        }
    });

    socket.on("add-candidate", (req) => {
        // call candidate
        const { name, examiner } = req;
        const newObj = {
            candidate: name,
            examiner
        }
        let addedCandNumber = add(newObj, "pending");
        // JSON.parse(obj)

        const filePath = path.join(__dirname, './data.json');
        const jsonData = JSON.parse(fs.readFileSync(filePath));


        io.to(socket.id).emit("inform", addedCandNumber);
        io.emit("update-candidates", jsonData);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
