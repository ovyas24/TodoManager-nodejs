const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

let items = [];
let workList = [];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    let day = date.getdate();
    res.render('list',{listTittle:day,toDoList:items});
});

app.post('/',(req,res)=>{
    let item = req.body.item;
    if(req.body.list=='Work'){
        workList.push(item);
        res.redirect("/work")
    }else{
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work",(req,res)=>{
    res.render("list",{listTittle:'Work',toDoList:workList})
});

app.listen(3000,()=>{
    console.log("server running on port 3000");
}); 