const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const mysql = require('mysql');
const cors = require('cors');
const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const db = mysql.createPool({
    host : 'svc.sel5.cloudtype.app',
    port: 30416,
    user : 'root',
    password : '!Jaehwa3021',
    database : 'fl',
    // connectionLimit: 5,
    // connectTimeout: 30000,
    // acquireTimeout: 10000
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('연결 되었습니다.')
});

app.get('/api/moneyTblInfo', (req, res) => {
    console.log('moneyTablInfo Called..');
    const sqlQuery = "SELECT DATE_FORMAT(USE_DATE, '%Y-%m-%d') as USE_DATE, AMOUNT, IO_TYPE FROM money";
    
    db.query(sqlQuery, (err, data) => {
        if (err) {
            console.log('err');
            res.send(err);
        } else {
            console.log('success');
            res.send(data);
        }
    });
});

app.post('/api/registerAccount', (req, res) => {
    console.log('registerAccount Called..');
    const user_id = req.body.id;
    const user_pw = req.body.password;
    const user_name = req.body.name;

    const sqlQuery = "INSERT INTO member (user_id, user_pw, user_name) VALUES (?, ?, ?)";
    db.query(sqlQuery,[user_id, user_pw, user_name], (err, data) => {
        if(err) {
            console.log('err');
            res.send(err);
        } else {
            console.log('success');
            res.send(data);
        }
    });
});

app.listen(port, ()=>{
    console.log(`Connect at http://localhost:${port}`);
});