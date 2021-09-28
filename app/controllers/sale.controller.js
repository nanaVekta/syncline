const db = require('../models');
const Sale = db.sale;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.amount && !req.body.userId && !req.body.bookId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Sale
    const sale = new Sale({
        amount: req.body.amount,
        userId: req.body.userId,
        bookId: req.body.bookId
    });

    // Save Sale in the database
    sale.save()
        .then(data => {
            res.send({message: 'success', results: data});
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Sale."
            });
        });
}

exports.getUserSales = (req, res) => {
    Sale.find({userId: req.params.id})
        .populate('bookId')
        .populate('userId')
        .then(data => {
            res.send({sales: data, message: 'success'});
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving sales."
            });
        });
}

exports.getAll = (req, res) => {
    Sale.find()
        .populate('bookId')
        .populate('userId')
        .then(data => {
            res.send({sales: data, message: 'success'});
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving sales."
            });
        });
}