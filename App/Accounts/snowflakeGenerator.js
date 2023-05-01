//TODO USE SEPERATE AUTH SERVER.

const processID = 0;
const workerID = 1;
var itter = 0;
var incPlaceholderID = "000000000000";


module.exports.generate = () => {
    let incField = itter % 4095;
    let timestamp = new Date().getTime();
    let incID = incPlaceholderID.slice(incField.toString(2).length, incPlaceholderID.length) + incField.toString(2);

    itter++;
    return `${timestamp}${processID}${workerID}${incField}`
}   