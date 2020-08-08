const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-om:bba_admin123@cluster0.9xjs3.mongodb.net/todolistDB?retryWrites=true&w=majority",{ useUnifiedTopology: true ,useNewUrlParser: true});

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
    item:[itemsSchema]
}

const List = mongoose.model("List",listSchema);

app.get("/",(req,res)=>{
    Item.find({},(err,items)=>{
        if(items.length == 0){
            insertIfEmpty();
            res.redirect("/");
        }else{
            res.render('list',{listTittle:"Today",toDoList:items});
        }
    });
});

app.post('/',(req,res)=>{
    let itemName = req.body.item;
    let listName = req.body.list;

    const item = new Item({
        name:itemName,
    });
    if(listName=="Today"){
        item.save();
        res.redirect("/");
    }else{
        //req.body.list
        List.findOne({name:listName},(err,foundList)=>{
            foundList.item.push(item);
            foundList.save();
            console.log(listName+" Success");
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",(req,res)=>{
    const checkerItemId = req.body.checkbox;
    const listTittle = req.body.listName;

    if (listTittle=="Today"){
        Item.findByIdAndRemove(checkerItemId,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Removed "+ checkerItemId);
            }
        });
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name:listTittle},{$pull:{item:{_id:checkerItemId}}},(err,result)=>{
            if(!err){
                console.log("Removed "+ checkerItemId);
                res.redirect("/"+listTittle);
            }
        });
    }
});

app.get("/:route",(req,res)=>{
    const listName = _.capitalize(req.params.route);

    List.findOne({name:listName},(err,foundList)=>{
        if(!err){
            if(!foundList){
                //create list
                const list = new List({
                    name:listName,
                    item:defaultItem,
                });

                list.save();
                console.log(listName+" Success");
                res.redirect("/"+listName);
            }else{
                //show list
                res.render('list',{listTittle:listName,toDoList:foundList.item});
            }
        }
    });
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("server running on port 3000");
}); 