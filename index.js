const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: '119.59.96.60',
    port: '3306',
    user: 'am_admin',
    password: 'artmuseum@2022',
    database: 'artmuseum_db',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Express server is runnig at port no : ', port));

////////////////////// Valid ate User //////////////////////
app.post('/login', (req, res) => {
    let emp = req.body;
    var sql = "SET @Username = ?;SET @Password = ?;SET @IsSuccess = ?; \
    CALL validate_login(@Username ,@Password ,@IsSuccess); \
    SELECT @IsSuccess";
    mysqlConnection.query(sql, [emp.username, emp.password, emp.issuccess], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array) {
                    let dict = element[0];
                    // res.send(dict["@IsSuccess"]);
                    let data = {}
                    if(dict["@IsSuccess"] == "successful"){
                        data = {
                            result: "true",
                            message: "success",
                            response: {
                                exhibition: "MASTERS\nOLD AND\nNEW",
                                date: "APRIL 15 - SEPTEMBER 20",
                                optional: "FLOOR 5",
                                location: "151 3rd St\nSan Francisco, CA 94103",
                                time: "Open today\n10:00am-5:30pm",
                                email: emp.username
                            }
                        }
                    }
                    else{
                        data = {
                            result: "false",
                            message: "failed",
                            response: {
                                exhibition: "",
                                date: "",
                                optional: "",
                                location: "",
                                time: "",
                                email: emp.username
                            }
                        }
                    }
                    res.send(data)
                }
            });
        else
            console.log(err);
    })
});

////////////////////// Get all employees //////////////////////
app.get('/users', (req, res) => {
    mysqlConnection.query('SELECT * FROM user_tbl', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});
