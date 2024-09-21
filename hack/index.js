const {faker}= require ('@faker-js/faker');
const mysql= require('mysql2');
const express= require('express');
const app=express();
const path=require("path");
const methodOverride= require("method-override");
const { log } = require("console");

app.use(methodOverride("__method"));
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/Assets")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.listen("8080",()=>{
    console.log("Listening to port 8080.")
});
    
const connection=mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'hack',
        password: '12345'
});
console.log("connection established");
// let createRandomUser=()=>{
//         return [
//             faker.string.uuid(),
//             faker.internet.userName(),
//             faker.internet.email(),
//             faker.internet.password(),
//             faker.finance.accountName(),
//             ];
//     };
    
//     let users=[];
//     for(let  i=0; i<100; i++ ){
//         users.push(createRandomUser());
//     };

//     try{
//         q= "INSERT INTO user(id,username,email,password,acc_type) VALUES ?";
//         connection.query(q,[users],(err,res)=>{
//             if(err) throw err;
//             console.log(res);
//         });
//     }catch(err)
//     {
//         console.log(err);
//     }
app.get("/",(req,res)=>{
        try{
            res.render("index.ejs");
        } catch(err){
            res.send("Some Error Occurred.");
        }     
});

app.post("/",(req,res)=>{
    try{
        let{email,password}=req.body;
        let q=`select * from user WHERE email="${email}"`;
        connection.query(q,(err,result)=>{
            if(err) throw err;
            if (result.length == 0) {
                // Username already exists
                return res.send('<script>alert("Invalid Email!"); window.history.back();</script>');
            }
            let db_psswd=result[0]["password"];
            if(db_psswd==password){
                res.send("Logged In");
            }else{
                return res.send('<script>alert("Invalid Password!"); window.history.back();</script>');
            }
        })
    }catch(err){
        console.log(err);
    }
});

app.get("/user",(req,res)=>{
    try{
            res.render("createacc.ejs");
    }catch(err){
        console.log(err);
    }
});

app.patch("/user",(req,res)=>{
    try{
        let id= faker.string.uuid();
        let {acc_type,name,email,password}=req.body;
        const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
        connection.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            // Username already exists
            return res.send('<script>alert("Email already Registered!"); window.history.back();</script>');
        }
    
        let q= `INSERT INTO user(id,name,email,password,acc_type) VALUES (?,?,?,?,?)`;
        connection.query(q,[id,name,email,password,acc_type],(err,result)=>{
            if(err){
                throw err;
            }
            res.redirect("/");
        })})
    }catch(err){
        console.log(err);
    }
});
