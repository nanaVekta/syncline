const { authJwt } = require('../middlewares');
const controller = require('../controllers/sale.controller');

/**
 * sale routes
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
        '/api/sale',
        [authJwt.verifyToken],
        (req, res) => {
            controller.create(req, res)
        }
    )
    app.get(
        '/api/sale',
        [],
        (req, res) => {
            controller.getAll(req, res);
        }
    )
    app.get(
        '/api/sale/user/:id',
        [authJwt.verifyToken],
        (req, res) => {
            controller.getUserSales(req, res);
        }
    )

}