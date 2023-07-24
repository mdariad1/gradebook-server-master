//import moment from 'moment/moment.js'; 

var moment = require('moment');
var mysql = require('mysql');

module.exports = {getClassAttendance,postModifiedAttendance,postNewAttendance};


function getClassAttendance(id,callback){
  let array1 = [];
  let array2 = [];
  let attendanceList = [];
  let attendanceSheet = [];
  let nameList = [];

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fulger2001",
    database: "gradebook",
    multipleStatements: "True"
  });

  con.connect(function(err) {
    if (err) throw err;
    var command0 = `SELECT name,ID as id FROM class WHERE ID = ${id};`;
    var command = `SELECT DISTINCT DATE_ADD(date,INTERVAL 1 DAY) as date FROM attendance WHERE classID = ${id};`;
    var command2 = `SELECT fullName,DATE_ADD(date,INTERVAL 1 DAY) as date,value FROM attendance WHERE classID = ${id}`;
    con.query(mysql.format(command0+command+command2), function (err, result, fields) {
      if (err) throw err;
      let classinfo = Object.values(JSON.parse(JSON.stringify(result[0][0])));
      let dates = Object.values(JSON.parse(JSON.stringify(result[1])));
      let marks = Object.values(JSON.parse(JSON.stringify(result[2])));

      marks.forEach(function(item){
        if (nameList.includes(item.fullName) == false)
          nameList.push(item.fullName);
      });
   
      dates.forEach(item => array1.push(item.date))
      nameList.forEach(item => {
        marks.forEach(function(element){
          if (element.fullName == item){
            attendanceList.push({
              name : moment.utc(element.date).format('MM.DD.YY'),
              value : element.value
            })
          }    
        });
        attendanceSheet.push({
          name : item,
          att : attendanceList
        });
        attendanceList = [];
      })

      array1.forEach(item => array2.push(moment.utc(item).format('MM.DD.YY')));
      let final = {
        name : classinfo[0],
        id : classinfo[1],
        dates : array2,
        students : attendanceSheet
      }

      if (final.length == 0){
        callback(err,'Object not found!');
      }
      else{
        callback(null,final);
      }
      
    });

    con.end();
  });
};

function postNewAttendance(obj,callback){
 
  let enrolled = [];
  let checked = obj.values;
  let names = [];
  checked.forEach(attendance =>{names.push(attendance.student)})

  getEnrollments(obj.class,function(err,data){
    if (err) {
      console.log("ERROR : ",err);            
    } else {
      enrolled = data;
      var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "fulger2001",
        database: "gradebook",
        multipleStatements: "True"
      });
    
      con.connect(function(err) {
        if (err) throw err.message;
        let command = "";
        enrolled.forEach(item => {
          if (names.includes(item.fullName)){
            var person = checked.find(check => check.student === item.fullName);
            command = command + `INSERT INTO attendance (value,date,classID,studentID,fullName) VALUES ('${person.value}','${obj.date}',${obj.class},${item.studentID},'${item.fullName}');`;
          }
          else{
            command = command + `INSERT INTO attendance (value,date,classID,studentID,fullName) VALUES ('${null}','${obj.date}',${obj.class},${item.studentID},'${item.fullName}');`;
          }
        });
        command.slice(0, -1);
        var sql = mysql.format(command);
        con.query(sql, function (err, result, fields) {
          if (err){
            callback(err,'Object not inserted!');
          }
          else{
            callback(null,'Object inserted!');
          }
        });
        
        con.end();
      });

    } 
  })
};

function postModifiedAttendance(obj,callback){
 
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fulger2001",
    database: "gradebook",
    multipleStatements: "True"
  });

  con.connect(function(err) {
    if (err) throw err;
    let command = "";
    obj.changes.forEach(item => {
      command = command + `UPDATE attendance SET value = '${item.value}' WHERE date = '${moment(item.name,"DD.MM.YY").format('YYYY-MM-DD[T]HH:mm:ss')}' AND fullName = '${item.student}' AND classID = ${obj.class};`;
    });
    command.slice(0, -1);
    var sql = mysql.format(command);
    con.query(sql, function (err, result, fields) {
      if (err){
        callback(err,"Object not inserted!");
      }
      else{
        callback(null,'Object inserted!');
      }
    });
    
    con.end();
  });

 
};

function getEnrollments(classID,callback){
  
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "fulger2001",
    database: "gradebook",
    multipleStatements: "True"
  });

  con.connect(function(err) {
    if (err) throw err.message;
    var sql = mysql.format('SELECT CONCAT(student.name," ",student.surname) as fullName,classID,studentID FROM enrollment INNER JOIN student ON enrollment.studentID = student.ID WHERE classID = ?', [classID]);
    con.query(sql, function (err, result, fields) {
      if (err) 
        callback(err,null);
      else{
        callback(null,Object.values(JSON.parse(JSON.stringify(result))));
      }
  
    });
    con.end();
  });
}


let test = {
  "class": 2,
  "changes": [
      {"student": "Vasea Partizan", 
      "name": "13.01.23",
      "value": "Present" },
      { "student": "Zmau Balaur",
      "name": "13.01.23", 
      "value": "Absent" }
  ]
};

// getClassAttendance(2,function(err,result){
//    console.log(result);
// });

// postNewAttendance(test,function(err,result){
//   console.log(result);
// });

// postModifiedAttendance(test,function(err,result){
//   console.log(result);
// });




