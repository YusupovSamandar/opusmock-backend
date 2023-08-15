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

exports.getForSpecificExaminer = (req, res) => {
    const thisExaminerName = req.params.examiner;
    const result = read("all");
    const examinerObj = {
        pending: result.pending ? result.pending.filter((cnd) => cnd.examiner === thisExaminerName) : [],
        complete: result.complete ? result.complete.filter((cnd) => cnd.examiner === thisExaminerName) : []
    }
    res.json(examinerObj);
}