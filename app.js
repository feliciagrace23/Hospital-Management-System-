//jshint esversion : 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
var path = require('path');
const { userInfo } = require("os");

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname, { // host the whole directory
    extensions: ["html", "htm", "gif", "png", "jpeg", "css"],
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const dataUser = [
    {name : 'admin@gmail.com',
    pass : 'admin'}
];

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/WebsiteData", {useNewUrlParser:true});

const UserSchema = new mongoose.Schema({
    name : String,
    pass :String
});



app.get("/", function(req, res){
    res.sendFile(__dirname+ "/views/index.html")
})


app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", function(req,res){
    console.log("dapat");
    var getEmail = req.body.emailLogin;
    var getPassword = req.body.passwordLogin;
    console.log(getEmail,getPassword);
    for( let i=0; i <dataUser.length;i++){
        if (getEmail==dataUser[i].name && getPassword == dataUser[i].pass){
       
            res.render("HomePage",{NamaUser: getEmail});

        }};
    User.find({'name': getEmail}, function(err, docs){
        if (err){
            console.log(err);
        }else{
            if (docs[0].pass == getPassword){
                res.render("HomePage",{NamaUser: getEmail});
            };
        };
    })
    res.write("Password / email yang anda masukkan salah")
    res.write("Silahkan login kembali atau buat akun baru")
    res.send()
})

app.get("/signUp", function (req, res) {
    res.render("signUp");
})
app.post("/signUp", function(req,res){
    var getEmail = req.body.newEmail;
    var getPassword = req.body.newPassword;
    const User = mongoose.model("User", UserSchema);
 const data = new User({
    name : getEmail,
    pass : getPassword
});
    data.save()
    dataUser.push({name: getEmail, pass:getPassword});
    console.log(getEmail,getPassword);
    console.log(dataUser)
    res.render("login")
});

app.get("/HomePage", function(req,res){
    res.render("HomePage");
});

app.get("/Ranjang", function(req, res){
    res.render("Ranjang");
});

app.get("/PatientAdmission", function(req,res){
    res.render("PatientAdmission");
})

app.post("/PatientAdmission", function(req,res){

})

app.get("/Formulir", function(req,res){
    res.render("Formulir");
})



app.listen(3000, function(){
    console.log("Server is running on port 3000");
});