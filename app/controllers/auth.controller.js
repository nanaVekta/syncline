const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

let jwt = require('jsonwebtoken');
let bycrypt = require('bcryptjs');

/**
 * user signup
 * @date 2021-09-21
 * @param {object} req
 * @param {object} res
 * @returns {any}
 */
exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bycrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
    });

    user.save((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if(err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if(err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.status(200).send({ message: 'User created successfully!' });
                    });
                }
            );
        } else {
            Role.findOne({ name: 'user' }, (err, role) => {
                if(err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if(err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.status(200).send({ message: 'User created successfully!' });
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .populate('roles', '-__v')
    .exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        let passwordIsValid = bycrypt.compareSync(req.body.password, user.password);

        if(!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid password!'
            });
        }

        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        res.status(200).send({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            roles: authorities,
            accessToken: token
        });
    });
};