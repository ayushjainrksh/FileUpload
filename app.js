var express = require("express"),
    app     = express(),
    multer  = require("multer"),
    mongoose= require("mongoose"),
    fs      = require("fs");

app.set("view engine", "ejs");
app.use(express.static("assets"));

mongoose.connect("mongodb://localhost/fileDB");

var uploadSchema= new mongoose.Schema({
	name : String
});

var File = mongoose.model("File", uploadSchema);

var storage = multer.diskStorage({
	destination : "assets/uploads/",
	filename : function(req, file, cb){
		cb(null, file.fieldname + "-" + Date.now() + "jpg");
	}
});

var upload = multer({storage : storage});

app.get("/", function(req, res){
    res.render("index");
});

app.get("/upload", function(req, res){
	res.render("form");
});

app.post("/", upload.single("uploaded"),function(req, res){
    let data = {
    	name : req.file.path
    };
    File(data).save(function(err, newdata){
    	if(err) 
    		throw err;
    	res.send("File Uploaded");
    });
});

app.listen(5000, function(err){
    if(err)
    	console.log(err);
    else
    	console.log("Server has started....");
});