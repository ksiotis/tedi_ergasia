const bcrypt = require('bcryptjs');
const express = require('express');
const mysql = require('mysql2/promise');
const cors= require ('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const port = 3000;
const secretKey = 'shhhhh'

const multer  = require('multer');
const { allowedNodeEnvironmentFlags } = require('process');

//profile pics
const pathBase = './src/assets/profile_pics/';
const storage = multer.diskStorage({
    destination: function(req, file,cb) {
        cb(null, pathBase)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + (req.body.username).
        concat(".").concat(file.originalname.slice(-3)));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(new Error('Non accepted image type'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

//accomodation pics
const pathBase2 =  './src/assets/accommodation_pics/';
const storage2 = multer.diskStorage({
    destination: function(req, file,cb) {
        cb(null, pathBase2)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + (req.body.idHost) + "." + file.originalname.slice(-3));
    }
});

const upload2 = multer({
    storage: storage2,
    fileFilter: fileFilter
});

const app = express();
app.use(express.json());
app.use(cors());
app.use('/profile_pics', express.static('./src/assets/profile_pics'));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'homies',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.listen(port,() => {
    console.log(`Server started on port ${port}`)
})

function isEmpty(str) {
    return (!str || 0 === str.length);
}

app.get('/users', async(req, res) => { //get all users based on criteria 
    try {
        console.log(req.originalUrl);

        let myquery = "";
        let params = [];
        if (!isEmpty(req.query.username)) {
            myquery += " Username = ? AND";
            params.push(req.query.username);
        }
        if (!isEmpty(req.query.email)) {
            myquery += " Email = ? AND";
            params.push(req.query.email);
        }
        if (!isEmpty(req.query.role)) {
            myquery += " Role = ? AND";
            params.push(req.query.role);
        }
        if (!isEmpty(req.query.id)) {
            myquery += " idUsers = ? AND";
            params.push(req.query.id);
        }

        let results;
        if (myquery !== "") {
            myquery = myquery.slice(0,-3);
            results = await db.query(
                `SELECT u.idUsers, u.Email, u.Username, u.Name,
                 u.Surname, u.Telephone, u.Role, u.ProfilePicPath 
                FROM users u 
                WHERE` + myquery +
               ` ORDER BY u.Username`,
                params
            );
        }
        else {
            results = await db.query(
                `SELECT u.idUsers, u.Email, u.Username, u.Name,
                 u.Surname, u.Telephone, u.Role, u.ProfilePicPath 
                FROM users u 
                ORDER BY u.Role DESC, u.Username ASC`
            );
        }

        let token = isEmpty(req.headers.authorization) ? 'null' : req.headers.authorization.split(' ')[1];
        let user = null;
        if (token !== 'null' && !isEmpty(token)) {
            user = jwt.verify(token, secretKey);
            if (user) user = user.user;
        }

        if (user !== null) {
            try {
                results[0][0].loggedin = true;
                if (user.idUsers === results[0][0].idUsers)
                    results[0][0].same = true;
            } catch (error) {
                res.sendStatus(404);
                return;
            }
        }

        res.send(results[0])
    } catch (error) {
        res.sendStatus(500);
        console.error(error)
    }
});

app.get('/users/:username', async(req, res) => { //get info of target user
    try {
        console.log(req.originalUrl);
        let results = await db.query(
            `SELECT u.idUsers, u.Email, u.Username, u.Name, 
            u.Surname, u.Telephone, u.Role, u.ProfilePicPath 
            FROM users u
            WHERE u.Username = ?`, 
            req.params.username
        );
        if (results[0].length) 
            res.send(results[0]);
        else
            res.sendStatus(404);
    } catch (error) {
        res.sendStatus(500);
        console.error(error)
    }
});

app.post('/users', upload.single('picture'), async (req, res) => { //create new user
    try {
        console.log(`post /users ${req.body.username}`);
        
        if (req.body.username === '' || req.body.email === '' || 
            req.body.password === '' || req.body.name === '' ||
            req.body.surname === '' || req.body.telephone === '' ||
            req.body.role < 1 || req.body.role > 4) {
                return;
        }

        //if used username or email, delete saved image and return error
        let results = await db.query(
            `SELECT u.Username FROM users u 
            WHERE u.Username = ? OR u.Email = ?`, 
            [req.body.username, req.body.email]
        );
        if (results[0].length) {
            
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log(`successfully deleted ${req.file.path}`);
                } catch (err) {
                    console.error(`failed to delete ${req.file.path}`);
                }
            }
            res.sendStatus(400);
            return;
        }

        let hashedpassword = await bcrypt.hash(req.body.password, 10);

        results = await db.query(
            `INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [req.body.email, req.body.username, hashedpassword, req.body.name,
            req.body.surname, req.body.telephone, req.body.role,
            req.file ? (req.file.filename) : null]
        );
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
        console.error(error)
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log(`/login ${req.body.username}`);
        if (req.body.username === '' || req.body.password === '') { //empty check
            res.sendStatus(400);
            return;
        }

        let result = await db.query(
            `SELECT u.* FROM users u
            WHERE u.Username = ?`, [req.body.username]
        );
        if (result[0].length === 0) { //if user does not exist
            res.sendStatus(403);
            return;
        }
        if (result[0].length > 1) { //if found identical usernames
            console.error(`Identical usernames found: ${result[0][0].Username}`)
            res.sendStatus(500);
            return;
        }

        let user = result[0][0];
        let match = bcrypt.compareSync(req.body.password, user.Password);

        if (!match) { //if given wrong password
            res.sendStatus(403);
            return;
        }

        delete user.Password;
        let token = jwt.sign({ user }, secretKey);

        res.send({
            token: token
        });
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.put('/users/:username', upload.single('picture'), async (req, res) => { //update existing user
    try {
        //authorization check
        let token = req.headers.authorization.split(' ')[1];
        let user = null;
        if (token !== 'null' && token !== 'undefined') {
            user = jwt.verify(token, secretKey);
            if (user) user = user.user;
        }
        else {
            res.sendStatus(400);
            return;
        }

        console.log(`put /users/${req.params.username}`);
        let targetuser = req.params.username;

        //permissions check
        if (user.Username !== targetuser && user.Role !== 'admin') {
            res.sendStatus(403);
            return;
        }
        let result = await db.query( //have I given the correct password?
            `SELECT Password FROM users 
            WHERE idUsers = ?`, [user.idUsers]
        );
        if (result[0].length === 0) { //if logged in user is not on db
            res.sendStatus(500);
            return;
        }
        if (user.Role !== 'admin') { //if not done by an admin, require password to be givn in body
            let match = bcrypt.compareSync(req.body.password, result[0][0].Password);
            if (!match) { //if given wrong password
                res.sendStatus(403);
                return;
            }
        }

        //building the query
        let myquery = "";
        let params = [];
        if (!isEmpty(req.body.username)) {
            myquery += " Username = ?,";
            params.push(req.body.username);
        }
        if (!isEmpty(req.body.name)) {
            myquery += " Name = ?,";
            params.push(req.body.name);
        }
        if (!isEmpty(req.body.surname)) {
            myquery += " Surname = ?,";
            params.push(req.body.surname);
        }
        if (!isEmpty(req.body.email)) {
            myquery += " Email = ?,";
            params.push(req.body.email);
        }
        if (!isEmpty(req.body.telephone)) {
            myquery += " Telephone = ?,";
            params.push(req.body.telephone);
        }
        if (!isEmpty(req.body.role)) {
            myquery += " Role = ?,";
            params.push(req.body.role);
        }
        if (!isEmpty(req.file)) {
            myquery += " ProfilePicPath = ?,";
            params.push(req.file.filename);
        }
        
        params.push(targetuser);

        if (myquery !== "") {
            myquery = myquery.slice(0,-1);
            results = await db.query(
                `UPDATE users 
                SET` + myquery + `
                WHERE Username = ?`, 
                params
            );
            
            if (result[0].affectedRows === 0) { //if update did not succeed
                res.sendStatus(500);
                return;
            }
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
});

app.get('/messages', async(req, res) => { //get messages with from to, must be one of the two
    try {
        console.log(req.originalUrl);

        let token = req.headers.authorization.split(' ')[1];
        let user = null;
        if (token !== 'null' && token !== 'undefined') {
            user = jwt.verify(token, secretKey);
            if (user) user = user.user;
        }

        //if no from or to is given, bad request
        if (isEmpty(req.query.from) && isEmpty(req.query.to)) {
            res.sendStatus(400);
            return;
        }

        // if asking for a completely unrelated conversation, forbid
        if (user.Username !== req.query.from && user.Username !== req.query.to) {
            res.sendStatus(403);
            return;
        }
        
        //if bad limiting
        let startRow = '';
        let perpage = 0;
        if ((!isEmpty(req.query.page) && isEmpty(req.query.perpage)) ||
        (isEmpty(req.query.page) && !isEmpty(req.query.perpage))) {
            res.sendStatus(400);
            return;
        }
        if (!isEmpty(req.query.page) && !isEmpty(req.query.perpage)) {
            perPage = parseInt(req.query.perpage);
            startRow = (req.query.page - 1) * perPage;
        }

        //building the query
        let myquery = "";
        let params = [];
        if (!isEmpty(req.query.from)) {
            myquery += " f.Username = ? AND";
            params.push(req.query.from);
        }
        if (!isEmpty(req.query.to)) {
            myquery += " t.Username = ? AND";
            params.push(req.query.to);
        }

        let results = [];
        try {
            let result = await db.query(
                `SELECT COUNT(*) AS Count 
                FROM users t, users f, messages m 
                WHERE` + myquery + ` m.From = f.idUsers AND m.To = t.idUsers` ,
                params
            );
            results.push(result[0][0].Count);
            
            let mylimit = "";
            if (perPage != 0) {
                mylimit = `LIMIT ?,?` 
                params.push(startRow, perPage);
            }
            result = await db.query(
                `SELECT m.Subject, m.Message, m.Datetime, f.Username AS 'From', t.Username AS 'To'
                FROM users t, users f, messages m 
                WHERE` + myquery + ` m.From = f.idUsers AND m.To = t.idUsers 
                ORDER BY m.Datetime DESC ` +
                (mylimit !== '' ? mylimit : ''),
                params
            );
            results.push(result[0]);
            
            res.send(results);
        } catch (error) {
            res.sendStatus(500);
            console.log(error);
            return;
        }
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})

app.post('/messages', async (req, res) => { //send a new message, from is always the user provided by web-token
    try {
        if (req.body.to === "" || req.body.subject === "" || req.body.message === "") {
            res.sendStatus(400);
            return;
        }
        
        let token = req.headers.authorization.split(' ')[1];
        let user = null;
        if (token !== 'null' && token !== 'undefined') {
            user = jwt.verify(token, secretKey);
            if (user) user = user.user;
        }
        else {
            res.sendStatus(400);
            return;
        }

        if (req.body.to === user.Username) {
            res.sendStatus(400);
            return;
        }

        console.log(`post /messages from ${user.Username} to ${req.body.to}`);

        let result = await db.query(
            `SELECT idUsers FROM users 
            WHERE Username = ?`, [req.body.to]
        );
        if (result[0].length === 0) { //if user does not exist
            res.sendStatus(404);
            return;
        }
        let targetuserid = result[0][0].idUsers;
        let datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        result = await db.query(
            `INSERT INTO messages 
            VALUES (null, ?, ?, ?, ?, ?) `, 
            [user.idUsers, targetuserid, req.body.subject, req.body.message, datetime]
        );
        console.log(result);
        
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})

app.get('/', async (req,res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        let user = null;
        if (token !== 'null' && token !== 'undefined') {
            user = jwt.verify(token, secretKey);
            if (user) user = user.user;
        }
        else {
            res.sendStatus(400);
            return;
        }

        if (user.Role !== 'admin') {
            res.sendStatus(403);
            return;
        }
        
        console.log(`get /`);

        let queries = [
            `SELECT * FROM accomodationphotos`,
            `SELECT * FROM accomodationreview`,
            `SELECT * FROM accomodations`,
            `SELECT * FROM accomodations_has_characteristics`,
            `SELECT * FROM availabilitydates`,
            `SELECT * FROM characteristics`,
            `SELECT * FROM messages`,
            `SELECT * FROM searches`,
            `SELECT * FROM users`,
        ]
        let temp = await Promise.all(queries.map((q) => db.query(q)));
        results = {
            accomodationphotos: temp[0][0],
            accomodationreview: temp[1][0],
            accomodations: temp[2][0],
            accomodations_has_characteristics: temp[3][0],
            availabilitydates: temp[4][0],
            characteristics: temp[5][0],
            messages: temp[6][0],
            searches: temp[7][0],
            users: temp[8][0]
        };

        res.send(results);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

//THOMAS TESTING FUNCTIONS

//returns accommodation IDs that meet query criteria
app.get('/accommodations', async (req, res) => {
    try{
        console.log('I ENTERED /accommodations.');
        //search by host functionality
        if(!isEmpty(req.query.host)){
            let results = await db.query(
                `SELECT a.idAccomodation, a.Name 
                 FROM accomodations a
                 WHERE a.idHost = ?`,
                 [req.query.host] 
            );
            res.send(results[0]);
            res.sendStatus(200);
        }
        else{
            if(
                isEmpty(req.query.north)    || 
                isEmpty(req.query.west)     || 
                isEmpty(req.query.south)    || 
                isEmpty(req.query.east)     || 
                isEmpty(req.query.date1)    || 
                isEmpty(req.query.date2)    || 
                isEmpty(req.query.persons)  ||
                isEmpty(req.query.north)    ||
                isEmpty(req.query.wifi)     ||
                isEmpty(req.query.freezer)  ||
                isEmpty(req.query.heating)  ||
                isEmpty(req.query.kitchen)  ||
                isEmpty(req.query.tv)       ||
                isEmpty(req.query.parking)  ||
                isEmpty(req.query.lift)     ||
                isEmpty(req.query.livingRoom)
            ){
                console.log('EMPTY STRING IN QUERY!');
                req.send(400);
            }
            else{
                let criteria = {
    
                    north: Number(req.query.north),
                    west: Number(req.query.west),
                    south: Number(req.query.south),
                    east: Number(req.query.east),
                    date1: Date(req.query.date1),
                    date2: Date(req.query.date2),
                    persons: Number(req.query.persons),
                    wifi: Boolean(req.query.wifi === 'true'),
                    freezer: Boolean(req.query.freezer === 'true'),
                    heating: Boolean(req.query.heating === 'true'),
                    kitchen: Boolean(req.query.kitchen === 'true'),
                    tv: Boolean(req.query.tv === 'true'),
                    parking: Boolean(req.query.parking === 'true'),
                    lift: Boolean(req.query.lift === 'true'),
                    livingRoom: Boolean(req.query.livingRoom === 'true'),
                }
                console.log("SEARCH CRITERIA:");
                console.log(criteria);
    
                // getting all accommodations
                let results = await db.query(
                    `SELECT a.idAccomodation, a.Name, a.Type, a.Beds, a.PricePerNight, a.Latitude, a.Longtitude, a.Persons  
                     FROM accomodations a`, 
                );
                
                let accepted = [];
                
                // going through all accommodations
                for(let i = 0 ; i < results[0].length ; i++) {
                    console.log("EXAMINING " + results[0][i].idAccomodation);
                    
                    // if accommodation meets geographic and numeric criteria
                    if( 
                        criteria.south <= results[0][i].Latitude && results[0][i].Latitude <= criteria.north &&
                        criteria.west <= results[0][i].Longtitude && results[0][i].Longtitude <= criteria.east &&
                        criteria.persons <= results[0][i].Persons
                    ){
                        
                        console.log("WITHIN GEOGRAPHIC AND PEOPLE BOUNDS "  + results[0][i].idAccomodation);
                        
                        // getting reservations and disabled dates
                        let reservations = await db.query(
                            `SELECT r.From, r.To  
                            FROM reservations r
                            WHERE r.Accomodations_idAccomodation = ?`,
                            [results[0][i].idAccomodation]
                        );
        
                        let availabilitydates = await db.query(
                            `SELECT r.From, r.To  
                            FROM availabilitydates r
                            WHERE idAccomodation = ?`,
                            [results[0][i].idAccomodation]
                        );
                        let calendar = reservations[0].concat(availabilitydates[0]);
        
                        // flag for accepting results
                        let flag = true;
        
                        for(let j = 0 ; j < calendar.length ; j ++){
                    
                            let from = calendar[j].From;
                            let to = calendar[j].To;
                            from = new Date(from);
                            to = new Date(to);
                            
                            // check if any of the accommodations is incompatible
                            if((from <= criteria.date1 && criteria.date1 <= to) || (from <= criteria.date2 && criteria.date2 <= to)){
                                flag = false;
                                break;
                            }
                        }
                        
                        // if no incompatible dates were found
                        if(flag == true){
                            console.log("COMPATIBLE DATES " + results[0][i].idAccomodation);
                            
                            let chars = await db.query(
                                `SELECT a.Characteristics_idCharacteristics
                                FROM accomodations_has_characteristics a
                                WHERE Accomodations_idAccomodation = ?`,
                                [results[0][i].idAccomodation]
                            );
                            
                            
                            let currChars = [];
                            for(let j = 0 ; j < chars[0].length ; j++){
                                currChars.push(chars[0][j].Characteristics_idCharacteristics);
                            }
                            
                            let wantedChars = [];
                            if(criteria.wifi == true) wantedChars.push(0);
                            if(criteria.freezer == true) wantedChars.push(1);
                            if(criteria.heating == true) wantedChars.push(2);
                            if(criteria.kitchen == true) wantedChars.push(3);
                            if(criteria.tv == true) wantedChars.push(4);
                            if(criteria.parking == true) wantedChars.push(5);
                            if(criteria.lift == true) wantedChars.push(6);
                            if(criteria.livingRoom == true) wantedChars.push(7);
                            
                            let flag = true;
                            flag = wantedChars.every(i => currChars.includes(i)); //check if every wanted char is in the curr char
    
                            if(flag == true){
                                accepted.push(results[0][i].idAccomodation);
                            }
                        }
                    }
                }
                res.send(accepted);
                res.sendStatus(200);
            }
        }
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

// returns everything regarding this id
app.get('/accommodations/:id', async (req, res) => {
    try {
        console.log('I ENTERED /accommodations/:id');
        
        if(isEmpty(req.params.id)){
            console.log('EMPTY ID!');
            req.send(400);
        }
        else{
            let id = Number(req.params.id);
            console.log('FETCHING FOR ' + id);


            let accomodations = await db.query(
                `SELECT a.*  
                 FROM accomodations a
                 WHERE a.idAccomodation = ?`,
                 [id] 
            );

            let accomodationphotos = await db.query(
                `SELECT a.*  
                FROM accomodationphotos a
                WHERE a.idAccomodation = ?`,
                [id] 
            );

            let accomodationreview = await db.query(
                `SELECT a.*  
                FROM accomodationreview a
                WHERE a.Accomodations_idAccomodation = ?`,
                [id] 
            );

            let accomodations_has_characteristics = await db.query(
                `SELECT c.*  
                FROM accomodations_has_characteristics c
                WHERE c.Accomodations_idAccomodation = ?`,
                [id]
            );
    

            let reservations = await db.query(
                `SELECT r.* 
                FROM reservations r
                WHERE r.Accomodations_idAccomodation = ?`,
                [id]
            );

            let availabilitydates = await db.query(
                `SELECT r.*  
                FROM availabilitydates r
                WHERE idAccomodation = ?`,
                [id]
            );

            let final = {
                accomodations: accomodations[0],
                accomodationphotos: accomodationphotos[0],
                accomodationreview: accomodationreview[0],
                accomodations_has_characteristics: accomodations_has_characteristics[0],
                reservations: reservations[0],
                availabilitydates: availabilitydates[0],
            };
    
            res.send(final);
            res.sendStatus(200);
        }        
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

app.post('/accommodations/:id/reviews', async (req, res) => {
    try {
        console.log('I ENTERED REVIEW');
        if(isEmpty(req.body.UserId) || req.body.Rating == null || isEmpty(req.body.Text)){
            res.sendStatus(400);
            return;
        }
        else{
            let id = Number(req.params.id);
            
            results = await db.query(
                `INSERT INTO accomodationreview VALUES (?, ?, ?, ?)`, 
                [req.body.UserId, id, req.body.Rating, req.body.Text]
            );
        }
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

app.post('/accommodations/:id/reservations', async (req, res) => {
    try {
        console.log('I ENTERED RESERVE');
        if(isEmpty(req.body.UserId) || isEmpty(req.body.Date1) || isEmpty(req.body.Date2) || req.body.Price == null){
            res.sendStatus(400);
            return;
        }
        else{
            let id = Number(req.params.id);
            results = await db.query(
                `INSERT INTO reservations VALUES (?, ?, ?, ?, ?, ?)`, 
                [req.body.UserId, id, req.body.Date1, req.body.Date2, req.body.Persons, req.body.Price]
            );
        }
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})


app.post('/accommodations', upload2.array('images', 10), async (req, res) => {
    try {
        // console.log('I ENTERED REVIEW');
        let body = {
            content: JSON.parse(req.body.content)
        };
        
        //room type
        var type;
        if(body.content.type == 'Δωμάτιο') {
            type = 'room';
        }
        else{
            type = 'house';
        }

        //assign characteristics
        let charEntries = [];
        for(let i=0 ; i < body.content.characteristics.length ; i++){
            if(body.content.characteristics[i].status == true){
                charEntries.push(i);
            } 
        }
        // console.log(charEntries);

        // console.log(req.files[0].filename);
        
        //create new entry
   

        let results = await db.query(
            `INSERT INTO accomodations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                null,
                req.body.idHost, 
                body.content.title, 
                type,
                body.content.location,
                body.content.price,
                body.content.maxPersons,
                body.content.area,
                body.content.numBedrooms,
                body.content.numBeds,
                body.content.numBaths,
                body.content.minDays,
                body.content.description,
                body.content.extraCost,
                body.content.markerLatLng[1],
                body.content.markerLatLng[0],
                body.content.location,
                body.content.address,
                body.content.rules
            ]
        );
        // console.log(results);
        
        //adding characteristics
        for(let i = 0 ; i < charEntries.length ; i++){
            let newChar = await db.query(
                `INSERT INTO accomodations_has_characteristics VALUES (?, ?)`, 
                [results[0].insertId, charEntries[i]]
            );
        }
        
        //adding images
        for(let i = 0 ; i < req.files.length ; i++){
            let newPics = await db.query(
                `INSERT INTO accomodationphotos VALUES (?, ?, ?)`, 
                [null, results[0].insertId, req.files[i].filename]
            );
        }

        //adding disables dates
        for(let i = 0 ; i < body.content.newReservedDates.length ; i++){
            let newDates = await db.query(
                `INSERT INTO availabilitydates VALUES (?, ?, ?, ?)`, 
                [null, results[0].insertId, body.content.newReservedDates[i].From, body.content.newReservedDates[i].To]
            );
        }
        //updating existing entry
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

app.put('/accommodations/:id', upload2.array('images', 10), async (req, res) => {
    try {
        let id = Number(req.params.id);

        // console.log('I ENTERED REVIEW');
        let body = {
            content: JSON.parse(req.body.content)
        };
        
        //room type
        var type;
        if(body.content.type == 'Δωμάτιο') {
            type = 'room';
        }
        else{
            type = 'house';
        }

        //assign characteristics
        let charEntries = [];
        for(let i=0 ; i < body.content.characteristics.length ; i++){
            if(body.content.characteristics[i].status == true){
                charEntries.push(i);
            } 
        }
        // console.log(charEntries);

        // console.log(req.files[0].filename);
        let results = await db.query(
            `UPDATE accomodations 
            SET 
                idHost = ?,
                Name = ?,
                Type = ?,
                Directions = ?,
                PricePerNight = ?,
                Persons = ?,
                Area = ?,
                Bedrooms = ?,
                Beds = ?,
                Bathrooms = ?,
                MinimumDays = ?,
                Description = ?,
                ExtraCostPerPerson = ?,
                Longtitude = ?,
                Latitude = ?,
                Location = ?,
                Address = ?,
                Rules = ?
            WHERE idAccomodation = ?;`, 
            [
                req.body.idHost, 
                body.content.title, 
                type,
                body.content.location,
                body.content.price,
                body.content.maxPersons,
                body.content.area,
                body.content.numBedrooms,
                body.content.numBeds,
                body.content.numBaths,
                body.content.minDays,
                body.content.description,
                body.content.extraCost,
                body.content.markerLatLng[1],
                body.content.markerLatLng[0],
                body.content.location,
                body.content.address,
                body.content.rules,
                id, 
            ]
        );
        
        //deleting old characteristics
        let deleted = await db.query(
            `DELETE FROM accomodations_has_characteristics WHERE Accomodations_idAccomodation = ?;`,
            [id]
        );
        
        // adding new characteristics
        for(let i = 0 ; i < charEntries.length ; i++){
            let newChar = await db.query(
                `INSERT INTO accomodations_has_characteristics VALUES (?, ?)`, 
                [id, charEntries[i]]
            );
        }
    
        //adding images
        for(let i = 0 ; i < req.files.length ; i++){
            let newPics = await db.query(
                `INSERT INTO accomodationphotos VALUES (?, ?, ?)`, 
                [null, id, req.files[i].filename]
            );
        }
    
        //adding disables dates
        for(let i = 0 ; i < body.content.newReservedDates.length ; i++){
            let newDates = await db.query(
                `INSERT INTO availabilitydates VALUES (?, ?, ?, ?)`, 
                [null, id, body.content.newReservedDates[i].From, body.content.newReservedDates[i].To]
            );
        }
    
        //updating existing entry
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})









//ENDING THOMAS