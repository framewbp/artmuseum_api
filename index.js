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
                    res.send(dict["@IsSuccess"]);
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

// ////////////////////// Get by employees //////////////////////
// app.get('/employees/:id', (req, res) => {
//     mysqlConnection.query('SELECT * FROM eact_uat_db.employee_tbl as e1 \
//     left join eact_uat_db.employee_jobtitle_tbl as j1 \
//     on e1.job_code = j1.job_code WHERE empcode = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log(err);
//     })
// });

// ////////////////////// Create User //////////////////////

// app.post('/employees', (req, res) => {
//     let emp = req.body;
//     var sql = "SET @EmpCode = ?;SET @FirstName = ?;SET @LastName = ?; SET @ShiftCode = ?;SET @PasswordHash = ?;SET @CreateTime = ?;SET @IsSuccess = ?; \
//     CALL create_new_user(@EmpCode, @FirstName, @LastName, @ShiftCode, @PasswordHash, @CreateTime, @IsSuccess); \
//     SELECT @IsSuccess";
//     mysqlConnection.query(sql, [emp.empcode, emp.firstname, emp.lastname, emp.shiftcode, emp.passwordhash, emp.createtime, emp.issuccess], (err, rows, fields) => {
//         if (!err)
//             rows.forEach(element => {
//                 if (element.constructor == Array) {
//                     let dict = element[0];
//                     res.send(dict["@IsSuccess"]);
//                 }
//             });
//         else
//             console.log(err);
//     })
// });

// ////////////////////// Update User Informations //////////////////////

// app.put('/employees', (req, res) => {
//     let emp = req.body;
//     var sql = "SET @EmpCode = ?;SET @FirstName = ?;SET @LastName = ?; SET @ShiftCode = ?;SET @PasswordHash = ?;SET @CreateTime = ?;SET @IsSuccess = ?; \
//     CALL update_user_information(@EmpCode, @FirstName, @LastName, @ShiftCode, @PasswordHash, @CreateTime, @IsSuccess); \
//     SELECT @IsSuccess";
//     mysqlConnection.query(sql, [emp.empcode, emp.firstname, emp.lastname, emp.shiftcode, emp.passwordhash, emp.createtime, emp.issuccess], (err, rows, fields) => {
//         if (!err)
//             rows.forEach(element => {
//                 if (element.constructor == Array) {
//                     let dict = element[0];
//                     res.send(dict["@IsSuccess"]);
//                 }
//             });
//         else
//             console.log(err);
//     })
// });

// ////////////////////// Delete an employees //////////////////////
// app.delete('/employees/:id', (req, res) => {
//     mysqlConnection.query('DELETE FROM  employee_tbl WHERE empcode = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.send('Deleted successfully.');
//         else
//             console.log(err);
//     })
// });
