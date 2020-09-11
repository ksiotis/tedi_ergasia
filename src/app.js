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
app.use('/profile_pics', express.static('./src/assets/profile_pics'))

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

app.get('/users', async(req, res) => {
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
                WHERE` + myquery, 
                params
            );
        }
        else {
            results = await db.query(
                `SELECT u.idUsers, u.Email, u.Username, u.Name,
                 u.Surname, u.Telephone, u.Role, u.ProfilePicPath 
                FROM users u`
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
})

app.post('/users', upload.single('picture'), async (req, res) => {
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
            console.log("/signup: Client-side checks failed");
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
})

//THOMAS TESTING FUNCTIONS

//returns accommodation IDs that meet query criteria
app.get('/accommodations', async (req, res) => {
    try{
        console.log('I ENTERED /accommodations.');

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

app.post('/review', async (req, res) => {
    try {
        console.log('I ENTERED REVIEW');
        if(req.body.AccId == "" || req.body.UserId == "" || req.body.Rating == null || req.body.Text == ""){
            res.sendStatus(400);
            return;
        }
        else{
            results = await db.query(
                `INSERT INTO accomodationreview VALUES (?, ?, ?, ?)`, 
                [req.body.UserId, req.body.AccId, req.body.Rating, req.body.Text]
            );
        }
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

app.post('/spaces', async (req, res) => {
    try {
        console.log('I ENTERED SPACES');
      
        results = await db.query(
            `SELECT a.idAccomodation, a.Name  
            FROM accomodations a
            WHERE a.idHost = ?`,
            [req.body.id] 
        );
        // console.log(results);
        let final = [];
        for(let i=0 ; i < results[0].length ; i++){
            let item = {
                id: results[0][i].idAccomodation,
                name: results[0][i].Name
            }
            final.push(item);
        }
        
        res.send(final);
        
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

app.post('/fetch', async (req, res) => {
    try {
        // console.log('I ENTERED SPACES');
      
        results = await db.query(
            `SELECT a.*  
            FROM accomodations a
            WHERE a.idAccomodation = ?`,
            [req.body.id] 
        );
        // console.log(results[0]);
        var type;
        if(results[0][0].Type == 'room'){
            type = "Δωμάτιο";
        }
        else{
            type = "Οικεία"
        }

        images = await db.query(
            `SELECT a.Path  
            FROM accomodationphotos a
            WHERE a.idAccomodation = ?`,
            [req.body.id] 
        );
        // console.log(images[0]);
        let pictures = [];
        for(let i = 0 ; i < images[0].length ; i++){
            pictures.push(images[0][i].Path);
        }

        let chars = await db.query(
            `SELECT c.Characteristics_idCharacteristics  
            FROM accomodations_has_characteristics c
            WHERE c.Accomodations_idAccomodation = ?`,
            [req.body.id]
        );
        console.log(chars[0]);
        let temp = [
            {
                name: 'Wifi',
                icon: 'ion-wifi',
                status: false,
            },
            {
                name: 'Ψύξη',
                icon: 'ion-snow',
                status: false,
            },
            {
                name: 'Θέρμανση',
                icon: 'ion-thermometer',
                status: false,
            },
            {
                name: 'Κουζίνα',
                icon: 'ion-fast-food',
                status: false,
            },
            {
                name: 'Τηλεόραση',
                icon: 'ion-tv',
                status: false,
            },
            {
                name: 'Χώρος στάθμευσης',
                icon: 'ion-car',
                status: false,
            },
            {
                name: 'Ανελκυστήρας',
                icon: 'ion-arrow-up',
                status: false,
            },
            {
                name: 'Καθιστικό',
                icon: 'ion-happy-outline',
                status: false,
            },
        ];

        for(let i=0 ; i < chars[0].length ; i++){
            if(chars[0][i].Characteristics_idCharacteristics == 0){
                temp[0].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 1){
                temp[1].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 2){
                temp[2].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 3){
                temp[3].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 4){
                temp[4].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 5){
                temp[5].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 6){
                temp[6].status = true;
            }
            else if(chars[0][i].Characteristics_idCharacteristics == 7){
                temp[7].status = true;
            }
        }

        let reservations = await db.query(
            `SELECT r.From, r.To  
            FROM reservations r
            WHERE r.Accomodations_idAccomodation = ?`,
            [req.body.id]
        );

        let availabilitydates = await db.query(
            `SELECT r.From, r.To  
            FROM availabilitydates r
            WHERE idAccomodation = ?`,
            [req.body.id]
        );
        // console.log(reservations[0]);
        let dates = reservations[0].concat(availabilitydates[0]);


        let content = {
            id: req.body.id,
            title: results[0][0].Name,
            description: results[0][0].Description,
            images: pictures,
            area: results[0][0].Area,
            price: results[0][0].PricePerNight,
            extraCost: results[0][0].ExtraCostPerPerson,
            minDays: results[0][0].MinimumDays,
            maxPersons: results[0][0].Persons,
            numBaths: results[0][0].Bathrooms,
            numBeds: results[0][0].Beds,
            numBedrooms: results[0][0].Bedrooms,
            type: type,
            
            characteristics: temp,
            rules: results[0][0].Rules,

            location: results[0][0].Directions,
            address: results[0][0].Address,
            markerLatLng: [results[0][0].Latitude, results[0][0].Longtitude],

            disabledDates: dates,
            newReservedDates: [],
        }
    
        
        res.send(content);
        
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})

app.post('/submit_edit', upload2.array('images', 10), async (req, res) => {
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
        if (body.content.id == null) {

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


        }
        //updating existing entry
        else {

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
                    body.content.id, 
                ]
            );
            
            //deleting old characteristics
            let deleted = await db.query(
                `DELETE FROM accomodations_has_characteristics WHERE Accomodations_idAccomodation = ?;`,
                [body.content.id]
            );
            
            // adding new characteristics
            for(let i = 0 ; i < charEntries.length ; i++){
                let newChar = await db.query(
                    `INSERT INTO accomodations_has_characteristics VALUES (?, ?)`, 
                    [body.content.id, charEntries[i]]
                );
            }

            //adding images
            for(let i = 0 ; i < req.files.length ; i++){
                let newPics = await db.query(
                    `INSERT INTO accomodationphotos VALUES (?, ?, ?)`, 
                    [null, body.content.id, req.files[i].filename]
                );
            }

            //adding disables dates
            for(let i = 0 ; i < body.content.newReservedDates.length ; i++){
                let newDates = await db.query(
                    `INSERT INTO availabilitydates VALUES (?, ?, ?, ?)`, 
                    [null, body.content.id, body.content.newReservedDates[i].From, body.content.newReservedDates[i].To]
                );
            }

        }
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})


app.post('/reserve', async (req, res) => {
    try {
        console.log('I ENTERED RESERVE');
        console.log(req.body);
        if(req.body.AccId == "" || req.body.UserId == "" || req.body.Date1 == "" || req.body.Date2 == "" || req.body.Price == null){
            res.sendStatus(400);
            return;
        }
        else{
            results = await db.query(
                `INSERT INTO reservations VALUES (?, ?, ?, ?, ?, ?)`, 
                [req.body.UserId, req.body.AccId, req.body.Date1, req.body.Date2, req.body.Persons, req.body.Price]
            );
        }
        res.sendStatus(200);
    } 
    catch(error) {
        res.sendStatus(500);
        console.error(error);
    }
})




//ENDING THOMAS

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
})

app.put('/users', upload.single('picture'), async (req, res) => {
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
        console.log(`put /users ${req.body.username}`);

        let result = await db.query(
            `SELECT Password FROM users 
            WHERE idUsers = ?`, [user.idUsers]
        );
        if (result[0].length === 0) { //if user does not exist
            res.sendStatus(400);
            return;
        }
        if (result[0].length > 1) { //if found identical users
            console.error(`Identical users found: ${user.idUsers}`)
            res.sendStatus(500);
            return;
        }

        let match = bcrypt.compareSync(req.body.password, result[0][0].Password);

        if (!match) { //if given wrong password
            res.sendStatus(403);
            return;
        }
        
        result = await db.query(
            `UPDATE users
            SET Email = ?, Username = ?, Name = ?, Surname = ?, Telephone = ?, ProfilePicPath = ?
            WHERE users.idUsers = ?`, 
            [req.body.email, req.body.username, req.body.name, req.body.surname, req.body.telephone, req.file ? (req.file.filename) : user.ProfilePicPath,
            user.idUsers]
        );
        
        if (result[0].affectedRows === 0) { //if update did not succeed
            res.sendStatus(500);
            return;
        }
        if (result[0].affectedRows > 1) { //if updated more rows
            console.error(`Updated multiple rows with id: ${user.idUsers}`)
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})

app.put('/users', async (req, res) => {
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
        console.log(`put /users ${req.body.username}`);

        let result = await db.query(
            `SELECT Password FROM users 
            WHERE idUsers = ?`, [user.idUsers]
        );
        if (result[0].length === 0) { //if user does not exist
            res.sendStatus(400);
            return;
        }
        if (result[0].length > 1) { //if found identical users
            console.error(`Identical users found: ${user.idUsers}`)
            res.sendStatus(500);
            return;
        }

        let match = bcrypt.compareSync(req.body.password, result[0][0].Password);

        if (!match) { //if given wrong password
            res.sendStatus(403);
            return;
        }
        
        result = await db.query(
            `UPDATE users
            SET Email = ?, Username = ?, Name = ?, Surname = ?, Telephone = ?, ProfilePicPath = ?
            WHERE users.idUsers = ?`, 
            [req.body.email, req.body.username, req.body.name, req.body.surname, req.body.telephone, req.file ? (req.file.filename) : user.ProfilePicPath,
            user.idUsers]
        );
        
        if (result[0].affectedRows === 0) { //if update did not succeed
            res.sendStatus(500);
            return;
        }
        if (result[0].affectedRows > 1) { //if updated more rows
            console.error(`Updated multiple rows with id: ${user.idUsers}`)
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})

app.post('/changerole', async (req, res) => {
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
        console.log(`/changerole ${user.Username} changing ${req.body.username} to role ${req.body.role}`);

        if (req.body.role > 4 || req.body.role < 1 || req.body.role === '' || req.body.username === '') {
            res.sendStatus(400);
            return;
        }
        if (user.Role !== 'admin' && req.body.username !== null) {
            res.sendStatus(403);
            return;
        }

        let targetuser = req.body.username === null ? user.Username : req.body.username;

        let result = await db.query(
            `SELECT idUsers FROM users 
            WHERE Username = ?`, [targetuser]
        );
        if (result[0].length === 0) { //if user does not exist
            res.sendStatus(400);
            return;
        }
        if (result[0].length > 1) { //if found identical users
            console.error(`Identical users found: ${user.idUsers}`)
            res.sendStatus(500);
            return;
        }
        
        let targetuserid = result[0][0].idUsers;

        result = await db.query(
            `UPDATE users SET Role = ? WHERE users.idUsers = ?`, 
            [req.body.role, targetuserid]
        );
        
        if (result[0].affectedRows === 0) { //if update did not succeed
            res.sendStatus(500);
            return;
        }
        if (result[0].affectedRows > 1) { //if updated more rows
            console.error(`Updated multiple rows with id: ${targetuserid}`)
            res.sendStatus(500);
            return;
        }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})

app.get('/messages', async(req, res) => { //get info of target user
    try {
        if (req.query.page === "" || req.query.perpage === "" || req.query.inbox === "")
            return;
            
        console.log(`/messages ${req.query.inbox != 0 ? 'inbox' : 'sent'}`);
            
        if (isNaN(parseInt(req.query.page)) || isNaN(parseInt(req.query.perpage)) || isNaN(parseInt(req.query.inbox)))
            res.sendStatus(400);
            
        let token = req.headers.authorization.split(' ')[1];
        let user = null;
        if (token !== 'null' && token !== 'undefined') {
            user = jwt.verify(token, secretKey);
            if (user) user = user.user;
        }

        let target = user.idUsers;
        let startRow = (req.query.page - 1) * req.query.perpage;
        let perPage = parseInt(req.query.perpage);
        
        let results = [];
        if (req.query.inbox != 0) {
            let result = await db.query(
                `SELECT COUNT(*) AS Count FROM messages m WHERE m.To = ?`,
                [target]
            );
            results.push(result[0][0].Count);
            
            result = await db.query(
                `SELECT m.Subject, m.Message, m.Datetime, u.Username AS 'Secondary' 
                FROM messages m, users u 
                WHERE m.From = u.idUsers AND m.To = ? 
                ORDER BY m.Datetime DESC 
                LIMIT ?,?`, 
                [target, startRow, perPage]
            );
            results.push(result[0]);
        }
        else {
            let result = await db.query(
                `SELECT COUNT(*) AS Count FROM messages m WHERE m.From = ?`,
                [target]
            );
            results.push(result[0][0].Count);

            result = await db.query(
                `SELECT m.Subject, m.Message, m.Datetime, u.Username AS 'Secondary' 
                FROM messages m, users u 
                WHERE m.To = u.idUsers AND m.From = ? 
                ORDER BY m.Datetime DESC 
                LIMIT ?,?`, 
                [target, startRow, perPage]
            );
            results.push(result[0]);
        }

        res.send(results);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})

app.post('/newmessage', async (req, res) => {
    try {
        if (req.body.to === "" || req.body.subject === "" || req.body.message === "")
            return;
        
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

        console.log(`/newmessage by ${user.Username} to ${req.body.to}`);

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
            VALUES (?, ?, ?, ?, ?) `, 
            [user.idUsers, targetuserid, req.body.subject, req.body.message, datetime]
        );
        console.log(result);
        
        // if (result[0].affectedRows === 0) { //if update did not succeed
        //     res.sendStatus(500);
        //     return;
        // }
        // if (result[0].affectedRows > 1) { //if updated more rows
        //     console.error(`Updated multiple rows with id: ${targetuserid}`)
        //     res.sendStatus(500);
        //     return;
        // }

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(403);
        console.error(error)
    }
})


app.get('/dbdownload', async (req,res) => {
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
        
        console.log(`/dbdownload`);

        let queries = [
            `SELECT * FROM accomodationphotos`,
            `SELECT * FROM accomodationreview`,
            `SELECT * FROM accomodations`,
            `SELECT * FROM accomodations_has_characteristics`,
            `SELECT * FROM availabilitydates`,
            `SELECT * FROM characteristics`,
            `SELECT * FROM messages`,
            `SELECT * FROM reservations`,
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
            reservations: temp[7][0],
            searches: temp[8][0],
            users: temp[9][0]
        };

        res.send(results);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

// app.get('/stopline', async (req, res) => {
//     let sql = `
//     SELECT l.code as 'name', l.type
//     FROM stops s, lines_has_stops ls, grammes l 
//     WHERE s.id = ls.stops_id && ls.lines_id = l.id && s.name = '${req.query.name}'
//     ORDER BY l.type ASC`;
//     try {        
//         let results = await db.query(sql);
//         res.send(results[0]);
//         // console.log('/stopline');
        
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500);
//     }
// })

// app.get('/stops/', async (req,res) => {
//     let sql = `SELECT name FROM stops ORDER BY name ASC`;
//     try {
//         let results = await db.query(sql);            
//         res.send(results[0]);
//         // console.log('/stops/');        
//     } catch (error) {
//         console.error(error);       
//         res.sendStatus(500);
//     }
// })

// app.get('/findroute', async (req, res) => {
//     try {
    
//         let queries = [
//             `SELECT l.code as 'line', l.type, s.amea, s.name
//             FROM stops s, lines_has_stops ls, grammes l
//             WHERE l.id = ls.lines_id AND ls.stops_id = s.id AND
//                 s.name = '${req.query.from}';`,

//             `SELECT l.code as 'line', l.type, s.amea, s.name
//             FROM stops s, lines_has_stops ls, grammes l
//             WHERE l.id = ls.lines_id AND ls.stops_id = s.id AND
//                 s.name = '${req.query.to}';`,

//             `SELECT s.name, s.amea, ls.index, l.type, l.code as 'line'
//             FROM stops s, lines_has_stops ls, grammes l, 
//                 (SELECT l.code as 'from'
//                 FROM stops s, lines_has_stops ls, grammes l
//                 WHERE l.id = ls.lines_id AND ls.stops_id = s.id AND
//                     s.name = '${req.query.from}') s1
//             WHERE s1.from = l.code AND l.id = ls.lines_id AND ls.stops_id = s.id
//             ORDER BY l.id, ls.index ASC;`,
            
//             `SELECT s.name, s.amea, ls.index, l.type, l.code as 'line'
//             FROM stops s, lines_has_stops ls, grammes l, 
//                 (SELECT l.code as 'to'
//                 FROM stops s, lines_has_stops ls, grammes l
//                 WHERE l.id = ls.lines_id AND ls.stops_id = s.id AND
//                     s.name = '${req.query.to}') s2
//             WHERE s2.to = l.code AND l.id = ls.lines_id AND ls.stops_id = s.id
//             ORDER BY l.id, ls.index ASC`
//         ]

//         let temp = await Promise.all(queries.map((q) => db.query(q)));
//         results = [temp[0][0], temp[1][0], temp[2][0], temp[3][0]];
//         // console.log('/findroute');
//         res.send(results);
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500);
//     }
// })

// app.get('/timetable', async (req,res) => {
//     try {        
//         let mycode = String(req.query.code);
        
//         let sql = `SELECT lt.times_time as 'name' 
//                 FROM lines_has_times lt, grammes l
//                 WHERE lt.grammes_id = l.id && l.code = '${mycode}'
//                 ORDER BY lt.times_time ASC`;
//         // console.log('/timetable');
                
//         let results = await db.query(sql);
//         res.send(results[0]);
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500);
//     }
// })

// app.post('/signup', async (req, res) => {
//     try {
//         let sql = `
//         SELECT * 
//         FROM users
//         WHERE username = '${req.query.username}'`
//         let result = await db.query(sql);
//         if (result[0].length > 0) {
//             res.send('username')
//             return
//         }

//         sql = `
//         SELECT * 
//         FROM users
//         WHERE email = '${req.query.email}'`
//         result = await db.query(sql);
//         if (result[0].length > 0) {
//             res.send('email')
//             return
//         }

//         sql = `
//         INSERT INTO users(username,email,password)
//         VALUES ('${req.query.username}','${req.query.email}','${req.query.password}')`
//         await db.query(sql);
//         db.query('COMMIT;')
//         res.send('complete');
//         // console.log('/signup');
//     } catch (error) {
//         console.error(error);       
//         res.sendStatus(500);
//     }
// })

// app.post('/login', async (req, res) => {
//     try {
//         let sql = `
//         SELECT *
//         FROM users
//         WHERE username = '${req.query.username}' and password = '${req.query.pw}'
//         `;
//         let result = await db.query(sql);
//         if (result[0].length === 1) {
//             res.send({id:result[0][0].id});
//             // console.log('/login');
//         } else {
//             res.send(false);
//         }
//     } catch(error) {
//         console.error(error)
//         res.sendStatus(500)
//     } 
// })

// app.post('/getname', async (req, res) => {
//     try {
//         let sql = `
//         SELECT username
//         FROM users
//         WHERE id = '${req.query.id}'
//         `;
//         let result = await db.query(sql);
//         res.send(result[0][0].username);
//         // console.log('/getname');
//     } catch(error) {
//         console.error(error)
//         res.sendStatus(500)
//     } 
// })

// app.post('/getcardid', async (req, res) => {
//     try {
//         let sql = `
//         SELECT number
//         FROM cards
//         WHERE users_id = '${req.query.id}'
//         `;
//         let result = await db.query(sql)
//         // console.log(result[0][0].number)
//         res.send(result[0][0].number)
//     } catch(error) {
//         console.error(error)
//         res.sendStatus(500)
//     } 
// })

// app.post('/getlower', async (req, res) => {
//     try {
//         let sql = `
//         SELECT lower
//         FROM users
//         WHERE id = '${req.query.id}'
//         `;
//         let result = await db.query(sql);
//         // console.log(result[0][0].username)
//         if (result[0][0].lower) {
//             res.send(true);
//         } else {
//             res.send(false);
//         }
//         // console.log('/getlower')

//     } catch(error) {
//         console.error(error)
//         res.sendStatus(500)
//     } 
// })

// app.post('/updatecart', async (req, res) => {
//     try {
//         // console.log(req.query.id)
//         ticketArray = req.body
//         // console.log(ticketArray.length)
//         // console.log(ticketArray)

//         for (var i = 0 ; i < ticketArray.length ; i++){
//             let ticket = ticketArray[i]
//             let ticketName = ticket.title
//             let ticketQuantity = Number(ticket.quantity)
//             // console.log(ticket)
//             let sql = `
//             SELECT id
//             FROM tickets
//             WHERE name = '${ticketName}'
//             `;
//             let result = await db.query(sql)
//             ticketID = result[0][0].id
//             // console.log(ticketID)

//             sql = `
//             SELECT number
//             FROM cards_has_tickets
//             WHERE cards_id = '${req.query.id}' and tickets_id = '${ticketID}'
//             `;
//             result = await db.query(sql)
//             // console.log(result[0][0].number)
//             ticketNumber = Number(result[0][0].number)
            
//             ticketQuantity += ticketNumber
//             sql = `
//             UPDATE cards_has_tickets
//             SET number = '${ticketQuantity}'
//             WHERE cards_id = '${req.query.id}' and tickets_id = '${ticketID}'
//             `
//             await db.query(sql)
//         }
//         await db.query('COMMIT;')
//         res.send('completed')
//     } catch(error) {
//         await db.query('ROLLBACK;')
//         // console.error(error)
//         res.sendStatus(500)
//     } 
// })

// app.post('/checkid', async (req, res) => {
//     try {
//         let sql = `
//         SELECT *
//         FROM cards
//         WHERE number = '${req.query.id}'
//         `;
//         let result = await db.query(sql);
//         console.log('/checkid');
//         if (result[0].length) {
//             res.send(true);
//         } else {
//             res.send(false);
//         }
//         // console.log(result[0].length);
        
//     } catch(error) {
//         console.error(error);
//         res.sendStatus(500);
//     } 
// })

// app.get('/userdetails', async (req, res) => {
//     try {
//         let queries = [`
//         SELECT username, email, firstname, lastname, imgName, lower
//         FROM users
//         WHERE id = '${req.query.id}'
//         `,`
//         SELECT c.number
//         FROM cards c, users u 
//         WHERE c.users_id = u.id && u.id = '${req.query.id}'
//         `];
//         // console.log(queries);
        
//         let temp = await Promise.all(queries.map((q) => db.query(q)));
//         results = [temp[0][0], temp[1][0]];
//         // console.log('/userdetails')
//         res.send(results);

//     } catch(error) {
//         console.error(error)
//         res.sendStatus(500)
//     } 
// })

// app.post('/checkpass', async (req, res) => {
//     try {
//         let sql = `
//         SELECT *
//         FROM users
//         WHERE id = '${req.query.id}' && password = '${req.query.totallynotapassword}'
//         `;
//         let result = await db.query(sql);
//         // console.log('/checkpass');
//         if (result[0].length) {
//             res.send(true);
//         } else {
//             res.send(false);
//         }
//     } catch(error) {
//         console.error(error);
//         res.sendStatus(500);
//     } 
// })

// app.post('/changepass', async (req, res) => {
//     try {
//         sql = `
//         UPDATE users
//         SET password = '${req.query.totallynotapassword}'
//         WHERE id = '${req.query.id}'
//         `;
//         await db.query(sql);
//         await db.query('COMMIT;');
//         res.send('completed');
//         // console.log('/changepass');
//     } catch(error) {
//         await db.query('ROLLBACK;');
//         console.error(error)
//         res.sendStatus(500);
//     }
// })
