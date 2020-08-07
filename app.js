const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolist",{ useUnifiedTopology: true ,useNewUrlParser: true});

const itemsSchema = {
    name:String,
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"Welcome to Todolist",
});

const item2 = new Item({
    name:"Hit + to add item to todo list.",
});

const item3 = new Item({
    name:"<--Hit this to delete item",
});


const defaultItem = [item1,item2,item3];
function insertIfEmpty(){
    Item.insertMany(defaultItem,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Success");
        }
    });
}

const listSchema = {
    name:String,
    item=[itemsSchema]
}

const List = mongoose.model("List",listSchema);

app.get("/",(req,res)=>{
    let day = date.getdate();
    Item.find({},(err,items)=>{
        if(items.length == 0){
            insertIfEmpty();
            res.redirect("/");
        }else{
            res.render('list',{listTittle:day,toDoList:items});
        }
    });
});

app.post('/',(req,res)=>{
    let itemName = req.body.item;
    if(req.body.list=='Work'){
        workList.push(item);
        res.redirect("/work")
    }else{
        const item = new Item({
            name:itemName,
        });
        item.save();
        res.redirect("/");
    }
});

app.post("/delete",(req,res)=>{
    const checkerItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkerItemId,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Removed "+ checkerItemId);
        }
    });
    res.redirect("/");
});

app.get("/:route",(req,res)=>{
    const listNmae = req.params.route;
    const list = new List({
        name:listNmae,
    });
});

app.listen(3000,()=>{
    console.log("server running on port 3000");
}); 