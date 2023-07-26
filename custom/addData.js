const fs = require('fs');
const path = require('path');


const add = (newObject, collectionName) => {
    // Read the JSON data from the file
    const filePath = path.join(__dirname, '../data.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath));

    // Add the new object to the "pending" array
    if (collectionName === "pending") {
        let currentId = jsonData.candidateNumber
        jsonData[collectionName].push({ ...newObject, id: currentId });
        jsonData.candidateNumber++;
    } else {
        jsonData[collectionName].push(newObject);
    }


    // Write the updated JSON data back to the file
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
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


    if (jsonData.pending[0]) {
        // Move the object from "pending" to "complete"
        const objectToMove = jsonData.pending.splice(0, 1)[0]; // Splice removes the object from the "pending" array and returns it
        jsonData.complete.push({ ...objectToMove, ...caller });

        // Write the updated JSON data back to the file
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        return objectToMove; // Indicate that the move was successful
    } else {
        return false; // Indicate that the object with the given ID was not found in the "pending" array
    }
}

module.exports = { add, read, moveFromPendingToComplete };