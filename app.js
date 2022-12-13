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
    {
        name: 'admin@gmail.com',
        pass: 'admin'
    }
];

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/WebsiteData", { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
    name: String,
    pass: String
});

const FormulirSchema = new mongoose.Schema({
    NamaPasien: String,
    NamaIbuKandung: String,
    TTL: String,
    Alamat: String,
    NoHp: String,
    Alergi: String,
    NamaLengkapWali: String,
    AlamatWali: String,
    PekerjaanWali: String,
    Hubungan: String,
    NamaDokter: String,
    KelasPerawatan: String,
    DokterPengirim: String,
    DokterPenerima: String,
    TanggalMasuk: String,
    Keluhan: String

});

const User = mongoose.model("User", UserSchema);


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
})


app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", function (req, res) {
  
    var getEmail = req.body.emailLogin;
    var getPassword = req.body.passwordLogin;


    


    User.find({ 'name': getEmail }, function (err, docs) {
        if (err) {
            console.log(err);
        } else if (docs != undefined){
            if (docs[0].pass === getPassword) {
                res.render("HomePage", { NamaUser: getEmail });
                
            } else {
                res.write("Password / email yang anda masukkan salah")
                res.write("Silahkan login kembali atau buat akun baru")
                res.send()
            }
        } else{
            for (let i = 0; i < dataUser.length; i++) {
                if (getEmail == dataUser[i].name && getPassword == dataUser[i].pass) {
        
                    res.render("HomePage", { NamaUser: getEmail });
        
                }
            };
        }
        ;
    })
})

app.get("/signUp", function (req, res) {
    res.render("signUp");
})
app.post("/signUp", function (req, res) {
    var getEmail = req.body.newEmail;
    var getPassword = req.body.newPassword;
    // const User = mongoose.model("User", UserSchema);
    const data = new User({
        name: getEmail,
        pass: getPassword
    });
    data.save()
    dataUser.push({ name: getEmail, pass: getPassword });
  
    res.render("login")
});

app.get("/HomePage", function (req, res) {
    res.render("HomePage");
});

app.get("/Ranjang", function (req, res) {
    res.render("Ranjang");
});

app.get("/PatientAdmission", function (req, res) {
    res.render("PatientAdmission");
})

app.post("/PatientAdmission", function (req, res) {

})

app.get("/Formulir", function (req, res) {
    res.render("Formulir");
})

app.post("/Formulir", function (req, res) {
    var namePatientInput = req.body.NamaLengkap;
    var NamaIbuInput = req.body.NamaIbu;
    var TtlInput = req.body.TempatLahir;
    var DomisiliInput = req.body.Domisili;
    var HpInput = req.body.NoHp;
    var AlergiInput = req.body.Alergi;
    var NamaWaliInput = req.body.NamaLengkapWali;
    var DomisiliWaliInput = req.body.DomisiliWali;
    var KerjaWaliInput = req.body.PekerjaanWali;
    var HubunganInput = req.body.HubunganWali;
    var namaDokterInput = req.body.NamaDokter;
    var kelasPerawatanInput = req.body.KelasPerawatan;
    var dokterPengirimInput = req.body.DokterPengirim;
    var dokterPenerimaInput = req.body.DokterPenerima;
    var tanggalMasukInput = req.body.TanggalMasuk;
    var keluhanInput = req.body.Keluhan;

    const Formulir = mongoose.model("Formulir", FormulirSchema);

    const data = new Formulir({
        NamaPasien: namePatientInput,
        NamaIbuKandung: NamaIbuInput,
        TTL: TtlInput,
        Alamat: DomisiliInput,
        NoHp: HpInput,
        Alergi: AlergiInput,
        NamaLengkapWali: NamaWaliInput,
        AlamatWali: DomisiliWaliInput,
        PekerjaanWali: KerjaWaliInput,
        Hubungan: HubunganInput,
        NamaDokter: namaDokterInput,
        KelasPerawatan: kelasPerawatanInput,
        DokterPengirim: dokterPengirimInput,
        DokterPenerima: dokterPenerimaInput,
        TanggalMasuk: tanggalMasukInput,
        Keluhan: keluhanInput
    });
    data.save()
    res.render("PatientAdmission")
});


app.get("/DataPasien", function (req, res) {

    res.render("DataPasien");
})

app.post("/DataPasien", function (req, res) {
    var userPasien = req.body.PasienChange;
    var history = req.body.HistoryAdd;
    const Formulir = mongoose.model("Formulir", FormulirSchema);
    // var dbo = db.db("mydb");
    // console.log()
    // Formulir.find({ 'NamaPasien': "FeliciaG" }, function (err, docs) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("hhhh")
    //         // console.log(docs)
    //     };
    // })
    Formulir.updateOne({ 'NamaPasien': userPasien }, { $set: { "history": history } }, function (err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.log(docs)
        }
    });
    // collection("Formulir").updateOne({'NamaPasien': "FeliciaG"}, {$set: {"history": "halo"}}, function(err, docs){
    //     if (err) throw err;
    //     console.log("add")
    // })
    res.render("DataPasien")
});


app.get("/obat", function (req, res) {
    res.render("obat")
})

app.get("/CDSS", function(req, res){
    res.render("cdss");
})


app.listen(3000, function () {
    console.log("Server is running on port 3000");
});