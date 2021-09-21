const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

/**
 * check if email or phone number is exists
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @return {void} 
 */
checkDuplicateEmailOrPhone = (req, res, next) => {
    User.findOne({
        phone: req.body.phone,
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err });
            return;
        }

        if(user) {
            res.status(400).send({message: 'Phone number already exists'});
            return;
        }

        User.findOne({
            email: req.body.email,
        }).exec((err, user) => {
            if(err) {
                res.status(500).send({message: err });  
                return; 
            }
            
            if(user) {
                res.status(400).send({message: 'Email already exists'});
                return;
            }

            next();
        });
    });
};

/**
 * check if role exists
 * @date 2021-09-21
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {any}
 */
checkRolesExisted = (req, res, next) => {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateEmailOrPhone,
    checkRolesExisted,
};

module.exports = verifySignUp;