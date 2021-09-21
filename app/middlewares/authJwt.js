const jwt = require('jsonwebtoken');
const config = require('../config/db.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

/**
 * verify token
 * @date 2021-09-21
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: 'No token provided!'});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({message: 'Unauthorized'});
        }
        req.userId = decoded.id;
        next();
    });
};

/**
 * check if user is admin
 * @date 2021-09-21
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if(err) {
                    res.status(500).send({message: err});
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        next();
                        return;
                    }
                }

                res.status(403).send({message: 'Not authorized'});
                return;
            }
        );
    });
};

/**
 * check if user is superadmin
 * @date 2021-09-21
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
isSuperAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err});
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles }
            },
            (err, roles) => {
                if(err) {
                    res.status(500).send({message: err});
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'superadmin') {
                        next();
                        return;
                    }
                }

                res.status(403).send({message: 'Not authorized'});
                return;
            }
        );
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isSuperAdmin
};

module.exports = authJwt;