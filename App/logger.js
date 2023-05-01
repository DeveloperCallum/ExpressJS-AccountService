module.exports.debugMode = false;
module.exports.silentErrors = false;

module.exports.logMessage = (message) => {
    if(this.debugMode){
        console.log(message)
    }
}

module.exports.logError = (message) => {
    if(!this.silentErrors){
        console.log(message)
    }
    
    //Log to file
}