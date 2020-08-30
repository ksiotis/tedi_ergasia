const bcrypt = require('bcryptjs');
const express = require('express');
const mysql = require('mysql2/promise');
const cors= require ('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const port = 3000;

const multer  = require('multer');
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

app.get('/checkusername', async(req, res) => {
    try {
        if (req.query.username === "")
            return;

        console.log(`/checkusername ${req.query.username}`);
        let results = await db.query(
            `SELECT u.Username FROM users u WHERE u.username = ?`, 
            [req.query.username]
        );
        res.send(results[0])
    } catch (error) {
        res.sendStatus(500);
        console.error(error)
    }
})

app.get('/checkemail', async(req, res) => {
    try {
        if (req.query.email === "")
            return;

        console.log(`/checkemail ${req.query.email}`);
        let results = await db.query(
            `SELECT u.Email FROM users u WHERE u.Email = ?`, 
            [req.query.email]
        );
        res.send(results[0])
    } catch (error) {
        res.sendStatus(500);
        console.error(error)
    }
})

app.post('/signup', upload.single('picture'), async (req, res) => {
    try {
        console.log(`/signup ${req.body.username}`);
        //TODO add non empty checks 

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
            res.sendStatus(400);
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
        let token = jwt.sign({ user }, 'shhhhh');

        res.send({
            token: token
        });
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
})

function verifyToken(req, res, next) {
    let bearer = req.headers.authorization;
    let user = jwt.verify(bearer, 'shhhhh');

    console.log(user);
    next();
}

// app.get('/lines/', async (req,res) => {
//     let sql = `SELECT code as 'name' FROM grammes ORDER BY code ASC`;
//     try {
//         let results = await db.query(sql);            
//         res.send(results[0]);
//         // console.log(sql);        
//     } catch (error) {
//         console.error(error);       
//         res.sendStatus(500);
//     }
// })

// app.get('/linestops', async (req,res) => {
//     let sql = `
//     SELECT s.name, s.amea 
//     FROM stops s, lines_has_stops ls, grammes l
//     WHERE s.id = ls.stops_id && ls.lines_id = l.id && l.code = '${req.query.code}'
//     ORDER BY ls.index ASC`;
//     try {        
//         let results = await db.query(sql);
//         res.send(results[0]);
//         // console.log('/linestops');
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500);
//     }
// })

// app.get('/linestop', async (req,res) => {
//     let sql = `
//     SELECT s.name
//     FROM stops s, lines_has_stops ls, grammes l
//     WHERE s.id = ls.stops_id && ls.lines_id = l.id && l.code = '${req.query.code}'
//     ORDER BY ls.index ASC`;
//     try {        
//         let results = await db.query(sql);
//         res.send(results[0]);
//         // console.log('/linestops');
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500);
//     }
// })

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