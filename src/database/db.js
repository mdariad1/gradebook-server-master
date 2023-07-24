var lib = require("./student.db")
var lib2 = require("./grades.db")
var lib3 = require("./attendance.db")
var lib4 = require("./teacher.db")
var lib5 = require("./institution.db")
var lib6 = require("./classes.db")



let test = {
    "class": 2,
    "date": '2023-02-25',
    "values": [
        {"student": "Vasea Partizan",
        "value": "Present" },
        { "student": "Zmau Balaur",
        "value": "Motivated" }
    ]
  };

// lib3.postNewAttendance(test,function(err,result){
//   console.log(result);
// });


lib.getSpecificStudent(1,function(err,result){
    console.log(result);
    console.log(result.attendance[0].name,result.attendance[0].values);
    console.log(result.attendance[1].name,result.attendance[1].values);
    
});

// lib2.getClassGrades(1,function(err,result){
//     console.log(result);
//     console.log(result.students[0]);
// });
// let institest = {
//     "name" : "UNIBUC",
//     "email": "senpai@asd",
//     "password": "spaceodissey68"
//   }

// lib5.postInstitution(institest,function(err,result){
//     console.log(result);
// });