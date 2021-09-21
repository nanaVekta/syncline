const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require('./app/models');
const PORT = process.env.PORT || 8080;
const Role = db.role;
const dbConfig = require('./app/config/db.config');

let corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Route works." });
});

// routes
require ('./app/routes/auth.routes')(app);
require ('./app/routes/user.routes')(app);
require ('./app/routes/book.routes')(app);

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to database');
    initial();
})
.catch((err) => {
    console.log('Error connecting to database', err);
    process.exit();
});

/**
 * Initialize the database
 * @date 2021-09-21
 * @returns {any}
 */
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new Role({
                name: 'user'
            }).save((err) => {
                if(err) {
                    console.log('Error ', err);
                }

                console.log('User role created');
            });

            new Role({
                name: 'admin'
            }).save((err) => {
                if(err) {
                    console.log('Error ', err);
                }

                console.log('Admin role created');
            });

            new Role({
                name: 'superadmin'
            }).save((err) => {
                if(err) {
                    console.log('Error ', err);
                }

                console.log('Superadmin role created');
            });
        }
    })
}