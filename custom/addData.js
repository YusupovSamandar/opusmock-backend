const fs = require('fs');
const path = require('path');

function insertAtSecondIndexOrLast(array, newElement) {

}


const add = (newObject, collectionName) => {
    // Read the JSON data from the file
    const filePath = path.join(__dirname, '../data.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath));

    // Add the new object to the "pending" array
    if (collectionName === "pending") {
        let currentId = jsonData.candidateNumber
        jsonData[collectionName].push({ ...newObject, id: currentId });
        jsonData.candidateNumber++;
    } else if (collectionName === "examiners") {
        const result = jsonData[collectionName].find(obj => obj.examinerName === newObject.examinerName);
        if (!result) {
            jsonData[collectionName].push(newObject);
        }
    }
    else {
        jsonData[collectionName].push(newObject);
    }


    // Write the updated JSON data back to the file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    return jsonData.candidateNumber - 1;
};


const read = (collectionName) => {
    const filePath = path.join(__dirname, '../data.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath));
    if (collectionName === "all") {
        return jsonData;
    } else {
        const data = jsonData[collectionName];
        return data;
    }
}

const moveFromPendingToComplete = (caller) => {
    const filePath = path.join(__dirname, '../data.json');

    // Read the JSON data from the file
    const jsonData = JSON.parse(fs.readFileSync(filePath));

    const indexToRemove = jsonData.pending.findIndex(obj => obj.examiner === caller.examinerName);

    if (indexToRemove !== -1) {
        // Move the object from "pending" to "complete"
        const objectToMove = jsonData.pending.splice(indexToRemove, 1)[0]; // Splice removes the object from the "pending" array and returns it
        jsonData.complete.push({ ...objectToMove, room: caller.room });

        // Write the updated JSON data back to the file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        return objectToMove; // Indicate that the move was successful
    } else {
        return false; // Indicate that the object with the given ID was not found in the "pending" array
    }
}

const skipCandidate = (cnd) => {
    const filePath = path.join(__dirname, '../data.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath));

    const indxToMove = jsonData.complete.findIndex(obj => obj.id === cnd.id);

    if (indxToMove) {
        const { room, ...objectToMove } = jsonData.complete.splice(indxToMove, 1)[0];

        if (jsonData.pending.length < 2) {
            jsonData.pending.push(objectToMove);
        } else {
            const examinerName = objectToMove.examiner;
            let count = 0;
            let indexToInsert = -1;

            for (let i = 0; i < jsonData.pending.length; i++) {
                if (jsonData.pending[i].examiner === examinerName) {
                    count++;
                    if (count === 2 || (count === 1 && indexToInsert === -1)) {
                        indexToInsert = i + 1;
                    }
                }
            }
            if (indexToInsert !== -1) {
                jsonData.pending.splice(indexToInsert, 0, objectToMove);
            } else {
                jsonData.pending.push(objectToMove);
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
        return true;
    }

}

const removeObject = (collection, givenName) => {
    const filePath = path.join(__dirname, '../data.json');

    // Read the JSON data from the file
    const jsonData = JSON.parse(fs.readFileSync(filePath));

    const filteredArray = jsonData[collection].filter(obj => obj.examinerName !== givenName);
    jsonData[collection] = filteredArray;

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
}

module.exports = { add, skipCandidate, read, moveFromPendingToComplete, removeObject };