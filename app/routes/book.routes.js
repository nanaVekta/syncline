const { authJwt } = require('../middlewares');
const controller = require('../controllers/book.controller');
const multer = require('multer');
const upload = multer();

/**
 * book routes
 * @date 2021-09-21
 * @param {any} app
 * @returns {any}
 */
module.exports = function(app) {
    app.use( function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers', 
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        '/api/book',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.uploadImg,
        controller.create
    )
}