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
        let match = bcrypt.compareSync(req.body.password, result[0][0].Password);
        if (!match) { //if given wrong password
            res.sendStatus(403);
            return;
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
        console.log(`UPDATE users 
        SET` + myquery + `
        WHERE users.Username = ?`, 
        params);
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
        // myquery = myquery.slice(0,-4);

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
            console.log(`SELECT m.Subject, m.Message, m.Datetime, f.Username AS 'From', t.Username AS 'To'
            FROM users t, users f, messages m 
            WHERE` + myquery + ` m.From = f.idUsers AND m.To = t.idUsers 
            ORDER BY m.Datetime DESC ` +
            (mylimit !== '' ? mylimit : ''),
            params);
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
