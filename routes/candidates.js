const { add, read } = require("../custom/addData");

exports.addCandidate = (req, res) => {
    const { name } = req.body;
    const newObj = {
        candidate: name
    }
    add(newObj, "pending");
    res.send(newObj);
}

exports.getPending = (req, res) => {
    const result = read("all");
    res.json(result);
}