const bcrypt = require('bcrypt');
const database = require('./database');
const logger = require("../logger");
const ErrorMessage = require("../../ExpressJS-Models/Messages/errorMessage");
const Message = require("../../ExpressJS-Models/Messages/systemMessage");
const jose = require('jose')
const saltRounds = 10;

exports.create = (username, password, attributes = null) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                logger.logError(err);
                return reject(new ErrorMessage("Password was not defined!", ErrorMessage.ErrorCodes.PASSWORD_MISSING));
            }

            database.createUser(username, hash).then((res) => {
                return resolve(res);
            }).catch((err) => {
                if (!err.errorcode) {
                    logger.logError(err);
                    return reject(new ErrorMessage(err, ErrorMessage.ErrorCodes.DATABASE_ERROR));
                }

                return reject(err);
            });
        });
    });
}

exports.getUser = (username, plaintextPassword) => {

}

exports.login = (username, plaintextPassword) => {
    return new Promise((resolve, reject) => {
        const secret = new TextEncoder().encode(
            'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
        )

        const alg = 'HS256'

        let user = database.getUser(username).then(async (res) => {
            const jwt = await new jose.SignJWT(res.toJson())
                .setProtectedHeader({ alg })
                .setIssuedAt()
                .setExpirationTime('2h')
                .sign(secret)

            resolve({ "token": jwt });
        });
    })
}

exports.compareHash = (hash, plaintext) => bcrypt.compareSync(plaintext, hash); 