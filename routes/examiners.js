const { add, read, removeObject } = require("../custom/addData");


exports.addExaminer = (req, res) => {
    add(req.body, "examiners");
    res.send("success");
}

exports.getExaminers = (req, res) => {
    const foundDT = read("examiners");
    res.send(foundDT);
}

exports.removeExaminer = (req, res) => {
    console.log(req.body);
    removeObject("examiners", req.body.name);

    res.send("removed");
}