var express = require('express');
var accounts = require('./Accounts/account');
var logger = require("./logger");
const e = require('express');
const app = express()
const port = 8080;

app.use(express.json());
logger.debugMode = true;

app.put('/user', (req, res) => {
    let username = req.body.username;
    let plaintextPassword = req.body.password;

    logger.logMessage(`Username: ${username}`)
    logger.logMessage(`Password: ${plaintextPassword}`)

    if (!username) {
        return res.send(new ErrorMessage("Username was not defined!", ErrorMessage.ErrorCodes.USERNAME_MISSING));
    }

    if (!plaintextPassword) {
        return res.send(new ErrorMessage("Password was not defined!", ErrorMessage.ErrorCodes.PASSWORD_MISSING));
    }

    accounts.create(username, plaintextPassword).then((response) => {
        //TODO: Return Token
        res.send(response);
    }).catch((err) => {
        if (err.statusCode) {
            res.status(err.statusCode);
        } else {
            res.status(500);
        }

        res.send(err);
    });
})

app.get('/user/:name', (req, res) => {
    let username = req.body.username;
    
})

app.post('/login', (req, res) => {
    console.log(`Login:`);
    let username = req.body.username;
    let plaintextPassword = req.body.password;

    logger.logMessage(`Username: ${username}`)
    logger.logMessage(`Password: ${plaintextPassword}`)

    if (!username) {
        return res.send(new ErrorMessage("Username was not defined!", ErrorMessage.ErrorCodes.USERNAME_MISSING));
    }

    if (!plaintextPassword) {
        return res.send(new ErrorMessage("Password was not defined!", ErrorMessage.ErrorCodes.PASSWORD_MISSING));
    }

    accounts.login(username, plaintextPassword).then((data) => {
        res.send(data);
    });
})

app.listen(port)
console.log(`app listening on localhost: ${port}`);