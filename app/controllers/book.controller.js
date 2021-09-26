const config = require('../config/auth.config');
const db = require('../models');
const Book = db.book;
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

/**
 * upload an image
 * @date 2021-09-21
 * @param {any} {storage:storage}
 * @returns {any}
 */
exports.uploadImg = multer({ storage: storage }).single('image');


/**
 * create a new book record
 * @date 2021-09-21
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
exports.create = (req, res) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        quantity: req.body.quantity,
        image: req.file.originalname
    });

    book.save((err) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({ message: 'Book created successfully!' });
    });
};

exports.getAll = (req, res) => {
    Book.find({}, (err, books) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({message:'success', books: books});
    });
}

exports.getById = (req, res) => {
    Book.findById(req.params.id, (err, book) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({message:'success', book: book});
    });
}

exports.delete = (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err, book) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({message:'success', book: book});
    });
}

exports.update = (req, res) => {
    Book.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, book) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({message:'success', book: book});
    });
}

exports.search = (req, res) => {
    Book.find({title: {$regex: req.params.title, $options: 'i'}}, (err, books) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        res.status(200).send({message:'success', books: books});
    });
}